import { ErrorCode } from "./ErrorCode.js"

export class AppError extends Error{
    constructor(
        public code:ErrorCode,
        message: string,
        public status: number = 400
    ){
        super(message)
        this.name = 'AppError'
    }
}