import express from "express";
import { loginController } from "../controllers/loginController.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validations/loginValidations.js";

const authRoutes = express.Router();

authRoutes.post("/", validate(loginSchema), loginController)

export default authRoutes