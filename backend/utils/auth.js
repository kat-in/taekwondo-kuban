import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const AUTH_DIR = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(AUTH_DIR, '..', '.env') });

export const passwordFingerprint = (hash) =>
  createHash('sha256').update(String(hash || '')).digest('base64url').slice(0, 16);

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Нет токена' });
  }
  let payload;
  try {
    payload = jwt.verify(token, globalThis.process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Невалидный токен' });
  }
  if (payload.pwd !== passwordFingerprint(globalThis.process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ success: false, message: 'Пароль был изменён, войдите заново' });
  }
  req.user = payload;
  next();
};
