import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
    getUsersAnalytics,
    getCoursesAnalytics,
    getOrdersAnalytics,
} from "../controllers/analytics.controller";

const AnalyticsRouter = express.Router();

AnalyticsRouter.get("/users-analytics", isAuthenticated, authorizeRoles("admin"), getUsersAnalytics);
AnalyticsRouter.get("/courses-analytics", isAuthenticated, authorizeRoles("admin"), getCoursesAnalytics);
AnalyticsRouter.get("/orders-analytics", isAuthenticated, authorizeRoles("admin"), getOrdersAnalytics);

export default AnalyticsRouter;