const { v4: uuidv4 } = require('uuid');
const db = require('../../db');

// In-memory adapter registry; adapters can be registered at startup
const adapterRegistry = {};

/**
 * Register a payment provider adapter.
 * @param {string} providerName - Unique provider identifier (e.g. 'stripe', 'razorpay').
 * @param {object} adapter - Object implementing { initiate, handleCallback, getStatus }.
 */
function registerAdapter(providerName, adapter) {
  adapterRegistry[providerName] = adapter;
}

/**
 * Resolve the active adapter from environment or default.
 */
function resolveAdapter(providerName) {
  const name = providerName || process.env.PAYMENT_PROVIDER || 'mock';
  const adapter = adapterRegistry[name];
  if (!adapter) {
    const err = new Error(`Payment provider adapter not found: ${name}`);
    err.status = 500;
    throw err;
  }
  return adapter;
}

/**
 * Persist a payment_attempt record.
 */
async function createPaymentAttempt(data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const record = {
    id,
    order_id: data.orderId,
    provider: data.provider,
    amount: data.amount,
    currency: data.currency,
    status: data.status || 'pending',
    provider_reference: data.providerReference || null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    created_at: now,
    updated_at: now,
  };

  await db('payment_attempts').insert(record);
  return record;
}

/**
 * Update an existing payment_attempt record.
 */
async function updatePaymentAttempt(id, updates) {
  const now = new Date().toISOString();
  await db('payment_attempts').where({ id }).update({
    ...updates,
    updated_at: now,
  });
  return db('payment_attempts').where({ id }).first();
}

/**
 * POST /payments/initiate
 * Creates a payment_attempt and delegates to the active provider adapter.
 */
async function initiatePayment(body, user) {
  const { orderId, amount, currency, provider, metadata } = body;

  const adapter = resolveAdapter(provider);

  // Create initial attempt record
  const attempt = await createPaymentAttempt({
    orderId,
    provider: adapter.name || provider || process.env.PAYMENT_PROVIDER || 'mock',
    amount,
    currency: currency || 'INR',
    status: 'pending',
    metadata,
  });

  // Delegate to provider
  let providerResponse;
  try {
    providerResponse = await adapter.initiate({
      paymentAttemptId: attempt.id,
      orderId,
      amount,
      currency: currency || 'INR',
      metadata,
      user,
    });
  } catch (adapterErr) {
    await updatePaymentAttempt(attempt.id, { status: 'failed' });
    throw adapterErr;
  }

  // Update attempt with provider reference
  const updated = await updatePaymentAttempt(attempt.id, {
    status: providerResponse.status || 'initiated',
    provider_reference: providerResponse.providerReference || null,
    metadata: providerResponse.metadata ? JSON.stringify(providerResponse.metadata) : attempt.metadata,
  });

  return {
    paymentId: attempt.id,
    status: updated.status,
    providerReference: updated.provider_reference,
    redirectUrl: providerResponse.redirectUrl || null,
    providerData: providerResponse.providerData || null,
  };
}

/**
 * POST /payments/callback (webhook handler)
 * Verifies and processes the callback from the payment provider.
 */
async function handleCallback(body, headers) {
  const providerName = body.provider || process.env.PAYMENT_PROVIDER || 'mock';
  const adapter = resolveAdapter(providerName);

  // Delegate signature verification and event parsing to adapter
  const event = await adapter.handleCallback(body, headers);

  const { paymentAttemptId, status, providerReference, metadata } = event;

  if (!paymentAttemptId) {
    const err = new Error('Payment attempt ID missing in callback event.');
    err.status = 400;
    throw err;
  }

  const attempt = await db('payment_attempts').where({ id: paymentAttemptId }).first();
  if (!attempt) {
    const err = new Error(`Payment attempt not found: ${paymentAttemptId}`);
    err.status = 404;
    throw err;
  }

  const updated = await updatePaymentAttempt(paymentAttemptId, {
    status: status || attempt.status,
    provider_reference: providerReference || attempt.provider_reference,
    metadata: metadata ? JSON.stringify(metadata) : attempt.metadata,
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    providerReference: updated.provider_reference,
  };
}

/**
 * GET /payments/:paymentId
 * Retrieves a payment attempt by ID.
 */
async function getPaymentById(paymentId, user) {
  const attempt = await db('payment_attempts').where({ id: paymentId }).first();
  if (!attempt) {
    const err = new Error(`Payment not found: ${paymentId}`);
    err.status = 404;
    throw err;
  }
  return {
    paymentId: attempt.id,
    orderId: attempt.order_id,
    provider: attempt.provider,
    amount: attempt.amount,
    currency: attempt.currency,
    status: attempt.status,
    providerReference: attempt.provider_reference,
    metadata: attempt.metadata ? JSON.parse(attempt.metadata) : null,
    createdAt: attempt.created_at,
    updatedAt: attempt.updated_at,
  };
}

/**
 * POST /payments/:paymentId/retry
 * Retries a failed payment attempt.
 */
async function retryPayment(paymentId, body, user) {
  const existing = await db('payment_attempts').where({ id: paymentId }).first();
  if (!existing) {
    const err = new Error(`Payment not found: ${paymentId}`);
    err.status = 404;
    throw err;
  }

  if (!['failed', 'cancelled', 'expired'].includes(existing.status)) {
    const err = new Error('Only failed, cancelled, or expired payments can be retried.');
    err.status = 400;
    throw err;
  }

  const providerName = body.provider || existing.provider || process.env.PAYMENT_PROVIDER || 'mock';
  const adapter = resolveAdapter(providerName);

  // Create a new attempt for the retry
  const newAttempt = await createPaymentAttempt({
    orderId: existing.order_id,
    provider: adapter.name || providerName,
    amount: existing.amount,
    currency: existing.currency,
    status: 'pending',
    metadata: existing.metadata ? JSON.parse(existing.metadata) : null,
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiate({
      paymentAttemptId: newAttempt.id,
      orderId: existing.order_id,
      amount: existing.amount,
      currency: existing.currency,
      metadata: existing.metadata ? JSON.parse(existing.metadata) : null,
      user,
    });
  } catch (adapterErr) {
    await updatePaymentAttempt(newAttempt.id, { status: 'failed' });
    throw adapterErr;
  }

  const updated = await updatePaymentAttempt(newAttempt.id, {
    status: providerResponse.status || 'initiated',
    provider_reference: providerResponse.providerReference || null,
    metadata: providerResponse.metadata
      ? JSON.stringify(providerResponse.metadata)
      : newAttempt.metadata,
  });

  return {
    paymentId: updated.id,
    previousPaymentId: paymentId,
    status: updated.status,
    providerReference: updated.provider_reference,
    redirectUrl: providerResponse.redirectUrl || null,
    providerData: providerResponse.providerData || null,
  };
}

module.exports = {
  registerAdapter,
  initiatePayment,
  handleCallback,
  getPaymentById,
  retryPayment,
};
