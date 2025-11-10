import { type Request, type Response,type NextFunction } from "express";
import { UrlService } from "../services/urlService.js";
import { StatusCodes } from "../enums/statusCodes.js";
import { AppError } from "../errors/AppError.js";
import type { IUrlService } from "../interfaces/IUrlService.js";
import { ErrorCode } from "../errors/ErrorCode.js";

export class UrlController{
    constructor (private _urlService:IUrlService){}

    async createShortUrl(req:Request,res:Response,next:NextFunction){
        try {
            const {originalUrl}=req.body
            const userId=(req as any).user.id

            const result=await this._urlService.createShortUrl(originalUrl,userId)
            res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status || StatusCodes.BAD_REQUEST).json({ message: error.message, code: error.code });
              } else {
                next(error);
              }
        }
    }

    async getUserUrls(req: Request, res: Response, next: NextFunction){
        try {
            const userId = (req as any).user.id;
            const urls = await this._urlService.getUserUrls(userId);
            res.status(StatusCodes.OK).json(urls);
          } catch (error) {
            if (error instanceof AppError) {
              res.status(error.status || StatusCodes.NOT_FOUND).json({ message: error.message, code: error.code });
            } else {
              next(error);
            }
          }
    }
    async redirect(req: Request, res: Response, next: NextFunction){
        try {
            const {shortId}=req.params
            const originalUrl=await this._urlService.redirect(shortId as string)
            if (!originalUrl) {
                throw new AppError(ErrorCode.NOT_FOUND, 'URL_NOT_FOUND',StatusCodes.NOT_FOUND);
            }
            console.log("Redirecting to:", originalUrl)
            res.redirect(originalUrl)
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status || StatusCodes.NOT_FOUND).json({ message: error.message, code: error.code });
            } else {
                next(error);
            }
        }
    }
    async deleteUrl(req:Request,res:Response,next: NextFunction){
        try {
            const { shortId } = req.params;
            const userId = (req as any).user.id;
            await this._urlService.deleteUrl(shortId, userId);
            res.status(StatusCodes.OK).json({ message: "URL deleted successfully" });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status || StatusCodes.BAD_REQUEST).json({ message: error.message, code: error.code });
            } else {
                next(error);
            }
        }
    }
}