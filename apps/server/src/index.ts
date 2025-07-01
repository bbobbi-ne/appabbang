/** packages */
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import swaggerUi from 'swagger-ui-express';

/** routes */
import commonCodeRouter from './routes/common-code.route';
import commonImagesRouter from './routes/common-images.route';
import authRouter from './routes/auth.route';
import breadsRouter from './routes/breads.route';
import deliveryMethodsRouter from './routes/delivery-methods.route';
import addressRouter from './routes/address.route';
import orderRouter from './routes/order.route';
import sampleRouter from './routes/sample.route';

/** utils */
import { loadAllCommonCodes } from './services/common-code.service';

/** docs */
import { swaggerSpec } from './docs/swagger';

/** middlewares */
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

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
app.use('/delivery-methods', deliveryMethodsRouter);
app.use('/address', addressRouter);
app.use('/orders', orderRouter);
app.use('/sample', sampleRouter);

// 헬스 체크용 라우터
app.get('/', (_, res) => {
  res.send('✅ Server is running!');
});

// SWAGGER: 개발 환경에서만 노출 (필요하면 운영에서 열려면 or 조건 추가)
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
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
