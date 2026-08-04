import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const OrderRouter = express.Router();

OrderRouter.post("/create-order", isAuthenticated, createOrder);
OrderRouter.get("/get-orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);

export default OrderRouter;
