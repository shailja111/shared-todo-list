import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ message: "Shared To-Do API is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));