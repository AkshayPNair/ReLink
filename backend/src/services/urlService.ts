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

        const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        if (originalUrl.startsWith(`${baseUrl}/api/url/`)) {
            throw new AppError(ErrorCode.ALREADY_SHORTENED_URL, "Cannot shorten an already shortened URL");
        }

        const existingUrl = await this._urlRepository.findByOriginalUrlAndUserId(originalUrl, userId);
        if (existingUrl) {
            throw new AppError(ErrorCode.DUPLICATE_ORIGINAL_URL, "This URL has already been shortened");
        }

        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            throw new AppError(ErrorCode.BAD_REQUEST, "URL must start with http:// or https://");
        }

        try {
            new URL(originalUrl);
            const urlObj = new URL(originalUrl);
            const hostname = urlObj.hostname;

            if (!hostname || hostname === '.' || hostname.startsWith('.') || hostname.endsWith('.') || hostname.length < 3) {
                throw new AppError(ErrorCode.BAD_REQUEST, "URL must contain a valid domain (e.g., example.com)");
            }

            if (!hostname.includes('.') || hostname === 'localhost' && urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new AppError(ErrorCode.BAD_REQUEST, "URL must contain a valid domain (e.g., example.com)");
            }

            const parts = hostname.split('.');
            if (parts.length < 2 || parts[0].length === 0 || parts[1].length === 0) {
                throw new AppError(ErrorCode.BAD_REQUEST, "URL must contain a valid domain with proper format (e.g., example.com)");
            }

            if (hostname === 'localhost' && urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new AppError(ErrorCode.BAD_REQUEST, "Localhost URLs must use http or https protocol");
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

    async deleteUrl(shortId: string, userId: string): Promise<void> {
        const url = await this._urlRepository.findByShortId(shortId);
        if (!url) {
            throw new AppError(ErrorCode.NOT_FOUND, "Short URL not found");
        }
        if (url.userId.toString() !== userId) {
            throw new AppError(ErrorCode.FORBIDDEN, "You can only delete your own URLs");
        }
        await this._urlRepository.deleteUrl(shortId);
    }
}
