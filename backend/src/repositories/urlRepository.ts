import Url,{type IUrl} from "../models/urlModel.js"
import { type IUrlRepository } from "../interfaces/IUrlRepository.js"

export class UrlRepository implements IUrlRepository{
    async createUrl(data: Partial<IUrl>): Promise<IUrl> {
        return await Url.create(data)
    }
    async findByUserId(userId: string): Promise<IUrl[]> {
        return await Url.find({userId})
    }
    async findByShortId(shortId: string): Promise<IUrl | null> {
        return await Url.findOne({shortId})
    }
}