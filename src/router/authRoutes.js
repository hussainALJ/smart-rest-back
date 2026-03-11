import express from "express";
import { loginController } from "../controllers/loginController.js";

const authRoutes = express.Router();

authRoutes.get("/", loginController)

export default authRoutes