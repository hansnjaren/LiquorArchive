// swagger.config.ts
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "LiquorArchive API",
    version: "1.0.0",
    description: "Next.js + Prisma 백엔드 API 문서",
  },
  // 보안 설정
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  schemas: {
    // 1. User
    User: {
      type: "object",
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        password: { type: "string", nullable: true },
        name: { type: "string" },
        image: { type: "string", nullable: true },
        gender: { type: "string", enum: ["MALE", "FEMALE"] },
        emailVerified: { type: "string", format: "date-time", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        deletedAt: { type: "string", format: "date-time", nullable: true },
      },
    },

    // 2. Bottle
    Bottle: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        category: {
          type: "string",
          enum: [
            "WHISKY",
            "WINE",
            "BRANDY",
            "RUM",
            "TEQUILA",
            "SAKE",
            "TRADITIONAL",
            "CHINESE",
            "OTHER",
          ],
        },
        country: { type: "string", nullable: true },
        volumeMl: { type: "integer", nullable: true },
        abv: { type: "number", format: "float", nullable: true },
        imageUrl: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    // 3. Purchase
    Purchase: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        bottleId: { type: "string" },
        purchaseDate: { type: "string", format: "date-time" },
        price: { type: "integer", nullable: true },
        place: { type: "string", nullable: true },
        memo: { type: "string", nullable: true },
        quantity: { type: "integer" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    // 4. DrinkType
    DrinkType: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        standardMl: { type: "number", format: "float" },
        abv: { type: "number", format: "float" },
        caloriesKcal: { type: "number", format: "float", nullable: true },
        iconUrl: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    // 5. DrinkingLog
    DrinkingLog: {
      type: "object",
      properties: {
        id: { type: "string" },
        userId: { type: "string" },
        date: { type: "string", format: "date-time" },
        locationName: { type: "string", nullable: true },
        locationLat: { type: "number", format: "float", nullable: true },
        locationLng: { type: "number", format: "float", nullable: true },
        feelingScore: { type: "integer" },
        note: { type: "string", nullable: true },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    },

    // 6. DrinkingLogDrinkType (복합키 모델)
    DrinkingLogDrinkType: {
      type: "object",
      properties: {
        drinkingLogId: { type: "string" },
        drinkTypeId: { type: "string" },
        amountMl: { type: "number", format: "float", nullable: true },
      },
    },
  },

  security: [{ bearerAuth: [] }],
};
