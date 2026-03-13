import express from "express";
import { menuPostController } from "../controllers/menuController.js";
import { menuSchema } from "../validations/menuValidation.js";
import { validate } from "../middlewares/validate.js";

const menuRoutes = express.Router();

menuRoutes.post("/", validate(menuSchema), menuPostController)

export default menuRoutes