import express from "express";
import { validate } from "../middlewares/validate.js";
import { orderSchema, orderStatusSchema } from "../validations/orderValidations.js";
import { ordersGetController, ordersPostController, ordersStatusPutController } from "../controllers/ordersController.js";
import { authenticate } from "../middlewares/authenticate.js";

const orderRoutes = express.Router();

orderRoutes.post("/", validate(orderSchema), ordersPostController)
orderRoutes.get("/", authenticate, ordersGetController);
orderRoutes.put("/:id/status", authenticate, validate(orderStatusSchema), ordersStatusPutController);

export default orderRoutes;