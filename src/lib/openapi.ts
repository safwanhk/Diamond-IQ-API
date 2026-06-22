export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Luxora API",
    description:
      "Luxury Asset Intelligence Platform — real-time valuation for diamonds, gold, and luxury watches.",
    version: "1.0.0",
    contact: {
      name: "DiamondIQ Support",
      email: "support@diamondiq.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      description: "API Server",
    },
  ],
  security: [{ ApiKeyAuth: [] }],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
        description: "Your DiamondIQ API key (format: diq_...)",
      },
    },
    schemas: {
      ValuationInput: {
        type: "object",
        required: ["carat", "color", "clarity", "cut", "certificate"],
        properties: {
          carat: { type: "number", minimum: 0.1, maximum: 20, example: 1.2 },
          color: {
            type: "string",
            enum: ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
            example: "D",
          },
          clarity: {
            type: "string",
            enum: [
              "FL", "IF", "VVS1", "VVS2", "VS1", "VS2",
              "SI1", "SI2", "I1", "I2", "I3",
            ],
            example: "VVS1",
          },
          cut: {
            type: "string",
            enum: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
            example: "Excellent",
          },
          certificate: {
            type: "string",
            enum: ["GIA", "IGI", "HRD", "None"],
            example: "GIA",
          },
        },
      },
      ValuationResult: {
        type: "object",
        properties: {
          estimatedPrice: { type: "number", example: 12500 },
          lowPrice: { type: "number", example: 11800 },
          highPrice: { type: "number", example: 13200 },
          confidence: { type: "integer", example: 94 },
          trend: { type: "string", enum: ["UP", "DOWN", "STABLE"], example: "UP" },
          investmentScore: { type: "integer", example: 88 },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          code: { type: "string" },
          details: { type: "object" },
        },
      },
      Usage: {
        type: "object",
        properties: {
          plan: { type: "string" },
          limit: { type: "integer" },
          used: { type: "integer" },
          remaining: { type: "integer" },
          percentage: { type: "number" },
          periodStart: { type: "string", format: "date-time" },
          periodEnd: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/v1/valuation": {
      post: {
        summary: "Get diamond valuation",
        description: "Returns estimated market price and analytics for a diamond.",
        tags: ["Valuation"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ValuationInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful valuation",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValuationResult" },
              },
            },
          },
          "400": { description: "Validation error" },
          "401": { description: "Invalid API key" },
          "429": { description: "Rate limit exceeded" },
        },
      },
    },
    "/api/v1/history": {
      get: {
        summary: "Get valuation history",
        tags: ["Valuation"],
        parameters: [
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
          },
        ],
        responses: {
          "200": { description: "List of historical valuations" },
        },
      },
    },
    "/api/v1/trends": {
      get: {
        summary: "Get market trends",
        tags: ["Market"],
        responses: {
          "200": { description: "Market trend data" },
        },
      },
    },
    "/api/v1/account/usage": {
      get: {
        summary: "Get API usage",
        tags: ["Account"],
        responses: {
          "200": {
            description: "Current usage statistics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Usage" },
              },
            },
          },
        },
      },
    },
    "/api/v1/apikeys": {
      post: {
        summary: "Create API key",
        description: "Requires JWT authentication via dashboard session.",
        tags: ["Account"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Production" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "API key created" },
        },
      },
    },
  },
};
