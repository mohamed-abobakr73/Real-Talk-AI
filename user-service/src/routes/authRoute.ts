import { Router } from "express";
import { signup } from "../controllers/authController";
import upload from "../config/multer";
import validateRequestBody from "../middlewares/validateRequestBody";
import { signupSchema } from "../schemas";

const authRouter = Router();

authRouter
  .route("/signup")
  .post(
    upload.single("profileImage"),
    validateRequestBody(signupSchema),
    signup
  );

export default authRouter;
