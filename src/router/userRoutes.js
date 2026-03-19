import express from "express";
import {
  usersPostController,
  usersGetController,
  usersDeleteController,
} from "../controllers/usersController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validate } from "../middlewares/validate.js";
import { userSchema } from "../validations/userValidation.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticate, isAdmin, usersGetController);
userRoutes.post("/", authenticate, isAdmin, validate(userSchema), usersPostController);
userRoutes.delete("/:id", authenticate, isAdmin, usersDeleteController);

export default userRoutes;