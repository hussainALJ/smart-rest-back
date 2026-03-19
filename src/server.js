import express from "express";
import "dotenv/config";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./router/authRoutes.js";
import menuRoutes from "./router/menuRoutes.js";
import categoryRoutes from "./router/categoriesRoutes.js";
import tableRoutes from "./router/tableRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to smart rest");
});

app.use("/api/auth/login", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tables", tableRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`working on http://localhost:${PORT}`));
