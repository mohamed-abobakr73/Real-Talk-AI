import Router from "express";

const usersRouter = Router();

usersRouter.route("/").get().post();
usersRouter.route("/:userId").get().patch().delete();

export default usersRouter;
