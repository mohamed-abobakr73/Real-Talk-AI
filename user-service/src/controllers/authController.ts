import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import authServices from "../services/authServices";
import httpStatusText from "../utils/httpStatusText";
import generateJWT from "../utils/jwtUtils/generateJWT";

const signup = asyncHandler(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const validatedRequestBody = req.validatedData;
    if (req.file) validatedRequestBody.profileImage = req.file.buffer;

    const createdUser = await authServices.signupService(validatedRequestBody);
    const tokenPayload = {
      id: createdUser.userId,
      email: createdUser.email,
    };

    const token = generateJWT(tokenPayload);

    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { user: createdUser, token },
    });
  }
);

export { signup };
