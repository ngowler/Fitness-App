import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

import errorHandler from "./api/v1/middleware/errorHandler";

import exerciseLibraryRoutes from "./api/v1/routes/exerciseLibraryRoutes"
import exerciseRoutes from "./api/v1/routes/exerciseRoutes"
import questionRoutes from "./api/v1/routes/questionRoutes"
import userRoutes from "./api/v1/routes/userRoutes"
import wourkoutRoutes from "./api/v1/routes/wourkoutRoutes"

const app: Express = express();
app.use(express.json());

app.use(morgan("combined"));

app.use("/api/v1/exercise-library", exerciseLibraryRoutes);
app.use("/api/v1/exercise", exerciseRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workout", wourkoutRoutes);

app.use(errorHandler);

export default app;
