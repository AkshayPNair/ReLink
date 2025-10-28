import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "../enums/statusCodes.js";
import { type IAuthService } from "../interfaces/IAuthService.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";

export class AuthController {
    constructor(private _authService: IAuthService) { }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            const user = await this._authService.register(name, email, password, confirmPassword);

            res.status(StatusCodes.CREATED).json({
                message: "Registered successfully",
                user,
            });
        } catch (error) {
            next(error); // pass to global errorMiddleware
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await this._authService.login(email, password);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(StatusCodes.OK).json({
                message: "Login successful",
                accessToken,
                user,
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                throw new AppError(ErrorCode.UNAUTHORIZED, "No refresh token provided", StatusCodes.UNAUTHORIZED);
            }

            const newAccessToken = await this._authService.refreshToken(token);
            res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
        } catch (error) {
            next(error);
        }
    }
}
