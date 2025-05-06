import Router from "express";
import { getUser } from "../controllers/usersController";

const usersRouter = Router();

// usersRouter.route("/").get().post();
usersRouter.route("/:userParam").get(getUser);

export default usersRouter;
