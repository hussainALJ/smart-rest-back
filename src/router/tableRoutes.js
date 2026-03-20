import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  tablesDeleteController,
  tablesGetController,
  tablesPostController,
} from "../controllers/tableController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const tableRoutes = express.Router();

tableRoutes.get("/", authenticate, tablesGetController);
tableRoutes.post("/", authenticate, isAdmin, tablesPostController);
tableRoutes.delete("/:id", authenticate, isAdmin, tablesDeleteController);

export default tableRoutes;