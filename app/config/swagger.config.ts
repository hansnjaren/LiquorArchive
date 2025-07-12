// swagger.config.ts
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "LiquorArchive API",
    version: "1.0.0",
    description: "Next.js + Prisma 백엔드 API 문서",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};
