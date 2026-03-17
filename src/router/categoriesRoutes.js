import express from "express";
import { categoriesGetController, categoriesPostController } from "../controllers/categoriesController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validate } from "../middlewares/validate.js";
import { categorySchema } from "../validations/categoryValidation.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", categoriesGetController);
categoryRoutes.post("/", authenticate, isAdmin, validate(categorySchema), categoriesPostController);

export default categoryRoutes;