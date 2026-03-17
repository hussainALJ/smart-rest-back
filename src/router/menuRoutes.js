import express from "express";
import {
  menuGetController,
  menuPostController,
} from "../controllers/menuController.js";
import { menuSchema } from "../validations/menuValidation.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const menuRoutes = express.Router();

menuRoutes.get("/", menuGetController);

menuRoutes.post("/", authenticate, isAdmin, validate(menuSchema), menuPostController);

export default menuRoutes;