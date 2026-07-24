const PaymentAdapterInterface = require('./payment.adapter.interface');

/**
 * MockAdapter
 *
 * Test-mode payment adapter.  All behaviour is driven by the `config` object
 * supplied to the constructor so that individual test cases can configure
 * success / failure responses without monkey-patching.
 *
 * Default behaviour (no config overrides): every operation succeeds.
 */
class MockAdapter extends PaymentAdapterInterface {
  /**
   * @param {Object}  [config={}]
   * @param {boolean} [config.shouldInitiatePaymentFail=false]  - Force initiatePayment to reject.
   * @param {boolean} [config.shouldVerifyPaymentFail=false]    - Force verifyPayment to return success=false.
   * @param {boolean} [config.shouldGetPaymentStatusFail=false] - Force getPaymentStatus to reject.
   * @param {boolean} [config.shouldInitiateRefundFail=false]   - Force initiateRefund to return success=false.
   * @param {boolean} [config.shouldHandleWebhookFail=false]    - Force handleWebhook to reject.
   * @param {string}  [config.paymentStatus='captured']         - Default payment status string.
   * @param {string}  [config.refundStatus='processed']         - Default refund status string.
   * @param {string}  [config.webhookEvent='payment.captured']  - Default webhook event type.
   * @param {Object}  [config.extraRaw={}]                      - Extra fields merged into every `raw` response.
   */
  constructor(config = {}) {
    super();

    this._config = {
      shouldInitiatePaymentFail: false,
      shouldVerifyPaymentFail: false,
      shouldGetPaymentStatusFail: false,
      shouldInitiateRefundFail: false,
      shouldHandleWebhookFail: false,
      paymentStatus: 'captured',
      refundStatus: 'processed',
      webhookEvent: 'payment.captured',
      extraRaw: {},
      ...config,
    };
  }

  /**
   * Allow individual config keys to be overridden after construction (useful
   * for sequential test scenarios).
   *
   * @param {Object} overrides - Partial config object.
   */
  configure(overrides = {}) {
    this._config = { ...this._config, ...overrides };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  _raw(extra = {}) {
    return { adapter: 'mock', ...this._config.extraRaw, ...extra };
  }

  _mockProviderOrderId(orderId) {
    return `mock_order_${orderId}`;
  }

  _mockProviderPaymentId(orderId) {
    return `mock_pay_${orderId}`;
  }

  _mockRefundId(providerPaymentId) {
    return `mock_rfnd_${providerPaymentId}`;
  }

  // ---------------------------------------------------------------------------
  // Interface implementation
  // ---------------------------------------------------------------------------

  /**
   * @inheritdoc
   */
  async initiatePayment(params) {
    const { orderId, amount, currency = 'INR', customerEmail, customerPhone, metadata = {} } = params;

    if (this._config.shouldInitiatePaymentFail) {
      throw new Error('MockAdapter: initiatePayment failed (configured failure).');
    }

    const providerOrderId = this._mockProviderOrderId(orderId);

    return {
      providerOrderId,
      providerSessionToken: `mock_session_${providerOrderId}`,
      redirectUrl: null,
      raw: this._raw({
        orderId,
        amount,
        currency,
        customerEmail,
        customerPhone,
        metadata,
        providerOrderId,
      }),
    };
  }

  /**
   * @inheritdoc
   */
  async verifyPayment(params) {
    const { providerOrderId, providerPaymentId, providerSignature, metadata = {} } = params;

    if (this._config.shouldVerifyPaymentFail) {
      return {
        success: false,
        status: 'failed',
        providerPaymentId: providerPaymentId || '',
        raw: this._raw({
          providerOrderId,
          providerSignature,
          metadata,
          reason: 'MockAdapter: verifyPayment configured to fail.',
        }),
      };
    }

    const resolvedPaymentId = providerPaymentId || this._mockProviderPaymentId(providerOrderId);

    return {
      success: true,
      status: this._config.paymentStatus,
      providerPaymentId: resolvedPaymentId,
      raw: this._raw({
        providerOrderId,
        providerPaymentId: resolvedPaymentId,
        providerSignature,
        metadata,
      }),
    };
  }

  /**
   * @inheritdoc
   */
  async getPaymentStatus(params) {
    const { providerOrderId } = params;

    if (this._config.shouldGetPaymentStatusFail) {
      throw new Error('MockAdapter: getPaymentStatus failed (configured failure).');
    }

    return {
      status: this._config.paymentStatus,
      amount: 0,
      currency: 'INR',
      raw: this._raw({ providerOrderId }),
    };
  }

  /**
   * @inheritdoc
   */
  async initiateRefund(params) {
    const { providerPaymentId, amount, reason = '', metadata = {} } = params;

    if (this._config.shouldInitiateRefundFail) {
      return {
        success: false,
        refundId: '',
        status: 'failed',
        raw: this._raw({
          providerPaymentId,
          amount,
          reason: 'MockAdapter: initiateRefund configured to fail.',
          metadata,
        }),
      };
    }

    const refundId = this._mockRefundId(providerPaymentId);

    return {
      success: true,
      refundId,
      status: this._config.refundStatus,
      raw: this._raw({
        providerPaymentId,
        refundId,
        amount,
        reason,
        metadata,
      }),
    };
  }

  /**
   * @inheritdoc
   */
  async handleWebhook(payload, headers) {
    if (this._config.shouldHandleWebhookFail) {
      throw new Error('MockAdapter: handleWebhook failed (configured failure).');
    }

    const providerOrderId = (payload && payload.order_id) || 'mock_order_unknown';
    const providerPaymentId = (payload && payload.payment_id) || this._mockProviderPaymentId(providerOrderId);

    return {
      event: this._config.webhookEvent,
      providerOrderId,
      providerPaymentId,
      status: this._config.paymentStatus,
      raw: this._raw({ payload, headers }),
    };
  }
}

module.exports = MockAdapter;
