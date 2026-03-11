import express from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./router/authRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to smart rest");
});

app.use("/api/auth/login", authRoutes)

app.use(errorHandler)

app.listen(PORT, () => console.log(`working on http://localhost:${PORT}`));
