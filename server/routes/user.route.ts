import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { activateUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.post("/registration", registrationUser);
UserRouter.post('/activate-user', activateUser);
UserRouter.post('/login', loginUser);
UserRouter.get('/logout', isAuthenticated, logoutUser);
UserRouter.get('/refresh', updateAccessToken);
UserRouter.get('/me', isAuthenticated, getUserInfo);
UserRouter.post('/social-auth', socialAuth);
UserRouter.put('/update-user-info', isAuthenticated, updateUserInfo);
UserRouter.put('/update-user-password', isAuthenticated, updatePassword);
UserRouter.put('/update-user-avatar', isAuthenticated, updateProfilePicture);
UserRouter.get("/get-all-users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
UserRouter.put("/update-user-role", isAuthenticated, authorizeRoles("admin"), updateUserRole);
UserRouter.delete("/delete-user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser);

export default UserRouter;