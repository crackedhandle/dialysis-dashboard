import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Dialysis Dashboard API",
      version: "1.0.0",
      description: "API documentation for Dialysis Monitoring System",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: {
            200: {
              description: "Server is healthy",
            },
          },
        },
      },
      "/schedule/today": {
        get: {
          summary: "Get today's schedule",
          parameters: [
            {
              name: "unitId",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Today's schedule",
            },
          },
        },
      },
      "/sessions": {
        post: {
          summary: "Create a dialysis session",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    patientId: { type: "string" },
                    unitId: { type: "string" },
                    startTime: { type: "string", format: "date-time" },
                    endTime: { type: "string", format: "date-time" },
                    preWeightKg: { type: "number" },
                    postWeightKg: { type: "number" },
                    systolicBP: { type: "number" },
                    diastolicBP: { type: "number" },
                    machineId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Session created",
            },
          },
        },
      },
    },
  };

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}