import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { generateSwaggerDocs } from "./swaggerOptions";

const setupSwagger = (app: Express): void => {
    const swaggerDocs: object = generateSwaggerDocs();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
