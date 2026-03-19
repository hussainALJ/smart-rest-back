import express from "express";
import { sessionStartController } from "../controllers/sessionsController.js";

const sessionRoutes = express.Router();

sessionRoutes.post("/start", sessionStartController);

export default sessionRoutes;