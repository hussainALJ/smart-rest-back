import express from "express";
import { categoriesGetController } from "../controllers/categoriesController.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", categoriesGetController);

export default categoryRoutes;