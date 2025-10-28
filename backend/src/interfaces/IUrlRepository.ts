import { type IUrl } from "../models/urlModel.js";

export interface IUrlRepository {
    createUrl(data: Partial<IUrl>): Promise<IUrl>;
    findByUserId(userId: string): Promise<IUrl[]>;
    findByShortId(shortId: string): Promise<IUrl | null>;
}