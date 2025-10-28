import { type IUser } from "../models/userModel.js";

export type AuthUser={
    id:string;
    name:string;
    email:string;
}

export interface IAuthService{
    register(name:string,email:string,password:string,confirmPassword:string):Promise<IUser>;
    login(email:string,password:string):Promise<{user:AuthUser; accessToken:string; refreshToken:string;}>;
    refreshToken(token: string): Promise<string>;
}