import Router from "express";
import { getUser, updateUser } from "../controllers/usersController";
import {
  validateRequestBody,
  verifyAccessOrRefreshToken,
} from "../middlewares";
import { updateUserSchema } from "../schemas";
import upload from "../config/multer";

const usersRouter = Router();

// usersRouter.route("/").get().post();
usersRouter.route("/:userParam").get(getUser);
usersRouter
  .route("/")
  .patch(
    verifyAccessOrRefreshToken("access"),
    upload.single("profileImage"),
    validateRequestBody(updateUserSchema),
    updateUser
  );

export default usersRouter;
