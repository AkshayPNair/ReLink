import type { IUser } from "../models/userModel.js";

export interface IUserRepository {
    createUser(data: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>
}