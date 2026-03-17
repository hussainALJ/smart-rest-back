import express from "express";
import {
  menuDeleteController,
  menuGetController,
  menuPostController,
  menuPutController,
} from "../controllers/menuController.js";
import { menuSchema } from "../validations/menuValidation.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { menuUpdateSchema } from "../validations/menuUpdateValidation.js";

const menuRoutes = express.Router();

menuRoutes.get("/", menuGetController);
menuRoutes.post("/", authenticate, isAdmin, validate(menuSchema), menuPostController);
menuRoutes.put("/:id", authenticate, isAdmin, validate(menuUpdateSchema), menuPutController);
menuRoutes.delete("/:id", authenticate, isAdmin, menuDeleteController);

export default menuRoutes;