import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import analysisRoutes from "./routes/analysisRoutes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/analyses", analysisRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
