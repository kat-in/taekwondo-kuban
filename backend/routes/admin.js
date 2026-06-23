import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
const router = express.Router();


dotenv.config();


router.post('/login', async (req, res) => {
  const { password } = req.body
  const isValid = bcrypt.compareSync(password, process.env.ADMIN_PASSWORD);
  if (isValid) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, message: 'Успешный вход', token: token });
  } else {
    res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
});

export default router