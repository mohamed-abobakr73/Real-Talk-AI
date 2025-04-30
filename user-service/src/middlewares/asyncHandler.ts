import { Request, Response, NextFunction } from "express";

type TAsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response | void>;

const asyncHandler = (asyncFunc: TAsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    asyncFunc(req, res, next).catch((error) => next(error));
  };
};

export default asyncHandler;
