import { type IUserRepository } from "../interfaces/IUserRepository.js";
import { hashPassword, comparePassword,} from "../utils/hashPassword.js";
import { generateAccessToken,generateRefreshToken,verifyRefreshToken } from "../utils/generateToken.js";
import type { IAuthService,AuthUser } from "../interfaces/IAuthService.js";
import type { IUser } from "../models/userModel.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";

export class AuthService implements IAuthService{
    constructor(private _userRepository:IUserRepository){}

    async register(name: string, email: string, password: string, confirmPassword: string): Promise<IUser> {
        if(password!==confirmPassword){
            throw new AppError(ErrorCode.VALIDATION_ERROR, "Passwords do not match", 400);
        }

        const existingUser=await this._userRepository.findByEmail(email)
        if(existingUser){
            throw new AppError(ErrorCode.USER_ALREADY_EXISTS, "User already exists", 400);
        }

        const hashedPassword=await hashPassword(password)
        const user=await this._userRepository.createUser({name,email,password:hashedPassword})
        return user
    }

    async login(email: string, password: string): Promise<{ user: AuthUser; accessToken: string; refreshToken: string; }> {
        const user=await this._userRepository.findByEmail(email)
        if(!user){
            throw new AppError(ErrorCode.USER_NOT_FOUND, "User not registered", 404);
        }

        const valid=await comparePassword(password, user.password)
        if(!valid){
            throw new AppError(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password", 401);
        }

        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        return{
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        }
    }

    async refreshToken(token: string) {
        try {
          const payload = verifyRefreshToken(token) as any;
          const newAccessToken = generateAccessToken(payload.id);
          return newAccessToken;
        } catch {
            throw new AppError(ErrorCode.INVALID_TOKEN, "Invalid or expired refresh token", 401);
        }
      }

}