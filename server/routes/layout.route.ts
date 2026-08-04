import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";

const LayoutRouter = express.Router();

LayoutRouter.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);
LayoutRouter.put("/edit-layout", isAuthenticated, authorizeRoles("admin"), editLayout);
LayoutRouter.get("/get-layout/:type", getLayoutByType);

export default LayoutRouter;