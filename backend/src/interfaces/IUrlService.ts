import type { IUrl } from "../models/urlModel.js";

export interface CreateShortUrlResponse{
    message:string;
    shortUrl:string;
    data:IUrl;
}

export interface IUrlService{
    createShortUrl(originalUrl:string,userId:string):Promise<CreateShortUrlResponse>;
    getUserUrls(userId:string):Promise<IUrl[]>;
    redirect(shortId:string):Promise<string>;
    deleteUrl(shortId: string, userId: string): Promise<void>;
}