/** packages */
import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

/** routes */
import authRouter from './routes/auth.route';
import breadRouter from './routes/bread.route';
import commonCodeRouter from './routes/common-code.route';
import commonImageRouter from './routes/common-image.route';
import customerRouter from './routes/customer.route';
import deliveryMethodRouter from './routes/delivery-method.route';
import orderRouter from './routes/order.route';
import orderRoundRouter from './routes/order-round.route';
import paymentRouter from './routes/payment.route';
import myRouter from './routes/my.route';
import couponRouter from './routes/coupon.route';

/** utils */
import { loadAllCommonCodes } from './services/common-code.service';

/** middlewares */
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();
const swaggerPath = path.resolve(__dirname, './docs/swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3300'],
    credentials: true,
  }),
);
app.use(fileUpload({ useTempFiles: true }));

// Routes
app.use('/auth', authRouter);
app.use('/breads', breadRouter);
app.use('/common-code', commonCodeRouter);
app.use('/common-images', commonImageRouter);
app.use('/customers', customerRouter);
app.use('/delivery-methods', deliveryMethodRouter);
app.use('/orders', orderRouter);
app.use('/order-round', orderRoundRouter);
app.use('/payments', paymentRouter);
app.use('/my', myRouter);
app.use('/coupons', couponRouter);

// 헬스 체크용 라우터
app.get('/', (_, res) => {
  res.send('✅ Server is running!');
});

// SWAGGER: 개발 환경에서만 노출 (필요하면 운영에서 열려면 or 조건 추가)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: `
        .curl-command,
        .opblock-section-header:has(.curl-command),
        .lang-bash,
        .bash {
          display: none !important;
        }
    `,
      swaggerOptions: {
        defaultModelRendering: 'example', // 기본 탭을 "curl"이 아니라 "Example Value"로!
        docExpansion: 'none', // 문서 펼침 여부: none | list | full
        tryItOutEnabled: false,
        defaultModelsExpandDepth: -1, // 왼쪽 스키마 자동 펼침 방지
        defaultExpands: ['components.schemas'],
      },
    }),
  );

  app.get('/swagger.json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(swaggerDocument);
  });
}

// 404 에러 핸들러 (라우터보다 뒤에 위치)
app.use(notFoundHandler);

// 에러 핸들링 미들웨어 (가장 마지막에 위치)
app.use(errorHandler);

async function initServer() {
  // 공통 코드 캐싱
  await loadAllCommonCodes();

  app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
    console.log('Swagger 문서: http://localhost:4000/api-docs');
  });
}

initServer();
