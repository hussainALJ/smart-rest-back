import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { isCashier } from "../middlewares/isCashier.js";
import { tablesGetController } from "../controllers/tableController.js";

const tableRoutes = express.Router();

tableRoutes.get("/", authenticate, isCashier, tablesGetController);

export default tableRoutes;