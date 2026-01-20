import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import User from "../models/User";

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=true`);
  }
};

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const user = await User.findById(userId).select("-__v");

  res.json(user);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
