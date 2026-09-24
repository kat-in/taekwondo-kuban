import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const AUTH_DIR = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(AUTH_DIR, '..', '.env') });

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Нет токена' });
  }
  try {
    req.user = jwt.verify(token, globalThis.process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Невалидный токен' });
  }
};