import express from "express";
import { menuPostController } from "../controllers/menuController.js";
import { menuSchema } from "../validations/menuValidation.js";
import { validate } from "../middlewares/validate.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const menuRoutes = express.Router();

menuRoutes.post("/", isAdmin, validate(menuSchema), menuPostController)

export default menuRoutes