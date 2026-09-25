import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

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
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Невалидный токен' });
  }
  if (payload.pwd !== passwordFingerprint(process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ success: false, message: 'Пароль был изменён, войдите заново' });
  }
  req.user = payload;
  next();
};
