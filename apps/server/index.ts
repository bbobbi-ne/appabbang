import express from 'express';
// import authRouter from './routes/auth';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
// app.use('/auth', authRouter);

app.post('/auth/login', async (req, res) => {
//   const { id, pw } = req.body;
  res.status(200).json({ 
    accessToken: 'old-access-token',
    refreshToken: 'old-refresh-token',
    });
});

app.get('/auth/me', async (req, res) => {
  res.status(200).json({
    no: 1,
    id: 'test1',
    name: '관리자',
    role: 'ADMIN',
  });
});

app.post('/auth/refresh', async (req, res) => {
  res.status(200).json({
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  });
});



app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});