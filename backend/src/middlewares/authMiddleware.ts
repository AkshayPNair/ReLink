import { type Request, type Response, type  NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";
import { StatusCodes } from "../enums/statusCodes.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "Access token missing", StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError(ErrorCode.UNAUTHORIZED, "Access token format invalid", StatusCodes.UNAUTHORIZED);
      }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as unknown as { id: string };
    (req as any).user = { id: decoded.id };

    next(); // Continue to controller
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      next(new AppError(ErrorCode.INVALID_TOKEN, "Access token expired", StatusCodes.UNAUTHORIZED));
    } else if (err.name === "JsonWebTokenError") {
      next(new AppError(ErrorCode.INVALID_TOKEN, "Invalid access token", StatusCodes.UNAUTHORIZED));
    } else {
      next(err);
    }
  }
};
