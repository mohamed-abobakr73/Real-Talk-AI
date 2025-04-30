import { Request, Response, NextFunction } from "express";

type TAsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = async (asyncFunc: TAsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return asyncFunc(req, res, next).catch((error) => next(error));
  };
};

export default asyncHandler;
