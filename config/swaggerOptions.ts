import swaggerJsDoc from "swagger-jsdoc";

const serverUrl: string =
    process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api/v1";

const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Fitness App API Documentation",
            version: "1.0.0",
            description:
                "This is the API documentation for the Fitness App applciation.",
        },
        server: [
            {
                url: serverUrl,
                description:
                    process.env.NODE_ENV === "production"
                        ? "Production Server"
                        : "Local Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/api/v1/routes/*.ts", "./src/api/v1/models/*.ts"],
};

export const generateSwaggerDocs = (): object => {
    return swaggerJsDoc(swaggerOptions);
};
