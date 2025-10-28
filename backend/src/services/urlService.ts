import { type IUrlRepository } from "../interfaces/IUrlRepository.js";
import { generateShortId } from "../utils/generateShortId.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/ErrorCode.js";
import { type CreateShortUrlResponse, type IUrlService } from "../interfaces/IUrlService.js";
import type { IUrl } from "../models/urlModel.js";
import mongoose from "mongoose";

export class UrlService implements IUrlService {
    constructor(private _urlRepository: IUrlRepository) { }

    async createShortUrl(originalUrl: string, userId: string): Promise<CreateShortUrlResponse> {
        if (!originalUrl) {
            throw new AppError(ErrorCode.BAD_REQUEST, "Original URL is required");
        }

        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            throw new AppError(ErrorCode.BAD_REQUEST, "URL must start with http:// or https://");
        }

        try {
            new URL(originalUrl);
            const urlObj = new URL(originalUrl);
            const hostname = urlObj.hostname;

            if (!hostname.includes('.') || hostname === 'localhost' && urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new AppError(ErrorCode.BAD_REQUEST, "URL must contain a valid domain (e.g., example.com)");
            }
        } catch {
            throw new AppError(ErrorCode.BAD_REQUEST, "Invalid URL format");
        }

        const shortId = generateShortId()
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const urlData = await this._urlRepository.createUrl({ shortId, originalUrl, userId: userObjectId })
        const shortUrl = `${process.env.BASE_URL || "http://localhost:8000"}/api/url/${shortId}`;

        return { message: "Short URL created successfully", shortUrl, data: urlData }
    }

    async getUserUrls(userId: string): Promise<IUrl[]> {
        const urls = await this._urlRepository.findByUserId(userId)
        return urls
    }

    async redirect(shortId: string): Promise<string> {
        const url = await this._urlRepository.findByShortId(shortId)
        if (!url) {
            throw new AppError(ErrorCode.NOT_FOUND, "Short URL not found");
        }
        return url.originalUrl
    }
}
