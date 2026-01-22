import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AuthenticationError("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as any).user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new AuthenticationError("Invalid token"));
    } else if (error.name === "TokenExpiredError") {
      next(new AuthenticationError("Token expired", "TOKEN_EXPIRED"));
    } else {
      next(error);
    }
  }
};
