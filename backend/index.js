import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { promises as fs } from 'fs';
import albumRoutes from './routes/albums.js'
import newsRoutes from './routes/news.js'
import videoRoutes from './routes/video.js'
import adminRoutes from './routes/admin.js'


dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(express.json());


app.use('/api/albums', albumRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/admin', adminRoutes)


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

