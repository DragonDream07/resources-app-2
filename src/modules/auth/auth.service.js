const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRES_MINUTES = 60;

function generateJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register({ email, password, firstName, lastName, phone }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null,
      role: 'CUSTOMER',
      isGuest: false,
    },
  });
  const token = generateJwt({ userId: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isGuest) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }
  const token = generateJwt({ userId: user.id, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

async function logout(token) {
  if (!token) return;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.blacklistedToken.create({
      data: {
        token,
        expiresAt,
      },
    });
  } catch (_err) {
    // Token invalid or expired — nothing to blacklist
  }
}

async function forgotPassword({ email }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.isGuest) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.upsert({
    where: { userId: user.id },
    update: { tokenHash, expiresAt, used: false },
    create: { userId: user.id, tokenHash, expiresAt, used: false },
  });

  // In production, dispatch an email here with the rawToken embedded in a reset URL.
  // Example: sendPasswordResetEmail(user.email, rawToken);
}

async function resetPassword({ token, password }) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const resetRecord = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, used: false, expiresAt: { gt: new Date() } },
  });
  if (!resetRecord) {
    const error = new Error('Password reset token is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: resetRecord.userId },
    data: { passwordHash },
  });
  await prisma.passwordResetToken.update({
    where: { id: resetRecord.id },
    data: { used: true },
  });
}

async function guestRegister({ email, cartId }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: '',
      firstName: null,
      lastName: null,
      phone: null,
      role: 'CUSTOMER',
      isGuest: true,
    },
  });
  if (cartId) {
    await prisma.cart.updateMany({
      where: { id: cartId, userId: null },
      data: { userId: user.id },
    });
  }
  const token = generateJwt({ userId: user.id, role: user.role, isGuest: true });
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      isGuest: user.isGuest,
    },
  };
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
};
