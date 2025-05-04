import { Response } from "express";

const sendRefreshTokenToCookies = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default sendRefreshTokenToCookies;
