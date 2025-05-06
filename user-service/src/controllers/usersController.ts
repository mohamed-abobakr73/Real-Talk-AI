import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares";
import usersServices from "../services/usersServices";

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userParam } = req.params;
    console.log(userParam);
    const user = await usersServices.getUserService(userParam);

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export { getUser };
