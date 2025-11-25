import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.get("/all-users", 
  checkAuth(Role.ADMIN), 
  userControllers.getAllUsers
);

router.get("/:id",checkAuth(Role.ADMIN))


router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema), // to validate data before update user information
  checkAuth(...Object.values(Role)), // Role based authenticated : every role can update user information
  userControllers.updateUser
);


export const UserRoutes = router;


