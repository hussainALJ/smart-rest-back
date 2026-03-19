import express from "express";
import {
  sessionBillController,
  sessionCheckoutController,
  sessionStartController,
} from "../controllers/sessionsController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isCashier } from "../middlewares/isCashier.js";

const sessionRoutes = express.Router();

sessionRoutes.post("/start", sessionStartController);
sessionRoutes.get("/:id/bill", sessionBillController);
sessionRoutes.put("/:id/checkout", authenticate, isCashier, sessionCheckoutController);

export default sessionRoutes;