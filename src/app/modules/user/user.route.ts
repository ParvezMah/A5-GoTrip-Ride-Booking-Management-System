import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.get("/all-users", 
  checkAuth(Role.ADMIN), 
  userControllers.getAllUsers
);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

export const UserRoutes = router;
