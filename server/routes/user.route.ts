import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { activateUser, loginUser, logoutUser, registrationUser } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.post("/registration", registrationUser);
UserRouter.post('/activate-user', activateUser);
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', isAuthenticated, logoutUser);

export default UserRouter;