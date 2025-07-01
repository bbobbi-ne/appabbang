import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appabbang API',
      version: '1.0.0',
      description: '아빠빵 어드민 API 문서',
      contact: {
        name: 'bbobbi-ne Team',
        email: '-',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: '개발 서버',
      },
      {
        url: 'https://api.appabbang.com',
        description: '운영 서버',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT 토큰을 Bearer 형식으로 전송하세요.',
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: '인증 관련 API',
      },
      {
        name: 'Breads',
        description: '빵 관리 API',
      },
      {
        name: 'Orders',
        description: '주문 관리 API',
      },
      {
        name: 'Address',
        description: '주소 관리 API',
      },
      {
        name: 'Delivery Methods',
        description: '배송 방법 관리 API',
      },
      {
        name: 'Common Code',
        description: '공통 코드 관리 API',
      },
      {
        name: 'Common Images',
        description: '공통 이미지 관리 API',
      },
      {
        name: 'Sample',
        description: '샘플 API',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // 📍 JSDoc 주석 경로
});
