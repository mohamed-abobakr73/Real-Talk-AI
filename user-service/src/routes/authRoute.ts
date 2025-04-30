import { Router } from "express";
import { signup } from "../controllers/authController";

const authRouter = Router();

authRouter.route("/signup").post(signup);

export default authRouter;
