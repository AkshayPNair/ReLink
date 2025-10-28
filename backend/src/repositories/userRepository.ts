import type { IUserRepository } from "../interfaces/IUserRepository.js";
import User,{type IUser} from "../models/userModel.js"

export class UserRepository implements IUserRepository{
    async createUser(data: Partial<IUser>): Promise<IUser> {
        return await User.create(data)
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({email})
    }
    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id)
    }
}