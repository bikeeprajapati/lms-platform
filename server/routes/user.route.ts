import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.post("/registration", registrationUser);
UserRouter.post('/activate-user', activateUser);
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', isAuthenticated, logoutUser);
UserRouter.get('/refresh', updateAccessToken);
UserRouter.get('/me', isAuthenticated, getUserInfo);
UserRouter.post('/social-auth', socialAuth);

export default UserRouter;