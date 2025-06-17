/** packages */
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

/** routes */
import commonCodeRouter from './routes/common-code.route';
import commonImagesRouter from './routes/common-images.route';
import authRouter from './routes/auth.route';
import breadsRouter from './routes/breads.route';

/** utils */
import { loadAllCommonCodes } from './services/common-code.service';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use('/common-code', commonCodeRouter);
app.use('/common-images', commonImagesRouter);
app.use('/auth', authRouter);
app.use('/breads', breadsRouter);

// 헬스 체크용 라우터
app.get('/', (_, res) => {
  res.send('✅ Server is running!');
});

async function initServer() {
  // 공통 코드 캐싱
  await loadAllCommonCodes();

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
  });
}

initServer();
