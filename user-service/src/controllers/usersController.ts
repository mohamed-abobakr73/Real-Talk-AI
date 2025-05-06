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

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedRequestBody = req.validatedData;
    validatedRequestBody.userId = req.currentUser?.userId;

    if (req.file) {
      validatedRequestBody.profileImage = req.file.buffer;
    }

    const updatedUser = await usersServices.updateUserService(
      validatedRequestBody
    );

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }
);

export { getUser, updateUser };
