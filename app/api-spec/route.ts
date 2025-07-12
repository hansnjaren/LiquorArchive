// app/api-spec/route.ts
import swaggerJsdoc from "swagger-jsdoc";
import { NextRequest, NextResponse } from "next/server";
import { swaggerDefinition } from "../config/swagger.config";

const options = {
  definition: swaggerDefinition,
  apis: ["./app/**/*.ts"],
};

export async function GET(req: NextRequest) {
  const spec = swaggerJsdoc(options);
  return new NextResponse(JSON.stringify(spec), {
    headers: { "Content-Type": "application/json" },
  });
}
