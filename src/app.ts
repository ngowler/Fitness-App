import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import exerciseLibraryRoutes from "./api/v1/routes/exerciseLibraryRoutes"
import exerciseRoutes from "./api/v1/routes/exerciseRoutes"
import questionRoutes from "./api/v1/routes/questionRoutes"
import userRoutes from "./api/v1/routes/userRoutes"
import wourkoutRoutes from "./api/v1/routes/wourkoutRoutes"

const app: Express = express();
app.use(express.json());

app.use("/api/v1/exercise-library", exerciseLibraryRoutes);
app.use("/api/v1/exercise", exerciseRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/workout", wourkoutRoutes);

export default app;
