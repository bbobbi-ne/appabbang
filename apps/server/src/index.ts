import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.route';
import commonCodeRouter from './routes/common-code.route';

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

// Routes
app.use('/common-code', commonCodeRouter);
app.use('/auth', authRouter);

// 헬스 체크용 라우터
app.get('/', (_, res) => {
  res.send('✅ Server is running!');
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
