import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import albumRoutes from './routes/albums.js'
import newsRoutes from './routes/news.js'
import videoRoutes from './routes/video.js'
import adminRoutes from './routes/admin.js'


const BACKEND_DIR = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(BACKEND_DIR, '.env') });
const app = express();
const port = globalThis.process.env.PORT || 5001;
app.use(cors())
app.use('/uploads', express.static(path.join(BACKEND_DIR, 'uploads')));
app.use(express.json());


app.use('/api/albums', albumRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/admin', adminRoutes)
app.get('/api/health', (req, res) => res.json({ success: true }))


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

