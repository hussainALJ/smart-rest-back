import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
 
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./router/authRoutes.js";
import menuRoutes from "./router/menuRoutes.js";
import categoryRoutes from "./router/categoriesRoutes.js";
import tableRoutes from "./router/tableRoutes.js";
import sessionRoutes from "./router/sessionRoutes.js";
import orderRoutes from "./router/orderRoutes.js";
import statsRoutes from "./router/statsRoutes.js";
import userRoutes from "./router/userRoutes.js";
import { initSocket } from "./socket/index.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}
if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL environment variable is not set");
}
 
const app = express();
const httpServer = createServer(app);
 
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
 
app.set("io", io);
initSocket(io);
 
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
 
app.get("/", (req, res) => {
  res.send("Smart Restaurant API is running");
});
 
app.use("/api/auth/login", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);
 
app.use(errorHandler);
 
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
