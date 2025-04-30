import { Router } from "express";

const authRouter = Router();

authRouter.route("/signup").post();

export default authRouter;
