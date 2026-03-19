import express from "express";
import { statsGetController } from "../controllers/statsController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";
 
const statsRoutes = express.Router();
 
statsRoutes.get("/", authenticate, isAdmin, statsGetController);
 
export default statsRoutes;