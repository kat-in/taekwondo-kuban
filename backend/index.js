import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import albumRoutes from './routes/albums.js'
import newsRoutes from './routes/news.js'
import videoRoutes from './routes/video.js'
import adminRoutes from './routes/admin.js'
import { ensureJsonFiles } from './utils/jsonStore.js'


const BACKEND_DIR = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(BACKEND_DIR, '.env'), quiet: true });

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 5001;
// HOST=127.0.0.1 закрывает API от внешних подключений: наружу смотрит только nginx
const host = process.env.HOST?.trim() || undefined;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// 0 или false — сервер за nginx на том же хосте; 1 — за одним прокси; N — за N прокси
const parseTrustProxy = (value) => {
  const raw = String(value ?? '1').trim().toLowerCase();
  if (raw === 'false' || raw === '0' || raw === 'no') return false;
  if (raw === 'true' || raw === 'yes') return true;
  const hops = Number.parseInt(raw, 10);
  return Number.isNaN(hops) || hops < 0 ? 1 : hops;
};

app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));
app.disable('x-powered-by');

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
  // Плеер Rutube смотрит Referer, чтобы понять, с какого домена открыли ролик.
  // С no-referrer он его не видит и отдаёт «видео временно недоступно».
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(cors({
  origin(origin, callback) {
    const isAllowed = !origin || !isProduction || allowedOrigins.includes(origin);
    if (isAllowed) return callback(null, true);
    return callback(new Error('Origin не разрешён политикой CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 600,
}));

app.use('/uploads', express.static(path.join(BACKEND_DIR, 'uploads'), {
  maxAge: isProduction ? '30d' : 0,
  index: false,
  dotfiles: 'deny',
}));
app.use(express.json({ limit: '256kb' }));

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Слишком много запросов, попробуйте позже' },
});

app.use('/api', apiLimiter);
app.use('/api/albums', albumRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/admin', adminRoutes)
app.get('/api/health', (req, res) => res.json({ success: true }))

app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Метод не найден' });
})

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Слишком большой объём данных' });
    }
    if (error instanceof SyntaxError && 'body' in error) {
        return res.status(400).json({ success: false, message: 'Некорректный JSON в теле запроса' });
    }
    if (error.message === 'Origin не разрешён политикой CORS') {
        return res.status(403).json({ success: false, message: 'Источник запроса не разрешён' });
    }
    console.error('Ошибка запроса:', error);
    res.status(error.status || 500).json({ success: false, message: 'Внутренняя ошибка сервера' });
})


export { app };

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
    const created = await ensureJsonFiles(
      ['news.json', 'albums.json', 'video.json'].map((name) => path.join(BACKEND_DIR, 'data', name)),
    );
    for (const file of created) {
        console.log(`Создан пустой файл данных ${file}`);
    }

    const server = host ? app.listen(port, host) : app.listen(port);
    server.on('listening', () => {
        console.log(`Сервер запущен на http://${host || '0.0.0.0'}:${port}`);
    });

    const shutdown = (signal) => {
        console.log(`Получен ${signal}, останавливаю сервер`);
        server.close(() => process.exit(0));
        setTimeout(() => process.exit(1), 10 * 1000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => console.error('Необработанное отклонение промиса:', reason));
    process.on('uncaughtException', (error) => {
        console.error('Необработанное исключение:', error);
        shutdown('uncaughtException');
    });
}
