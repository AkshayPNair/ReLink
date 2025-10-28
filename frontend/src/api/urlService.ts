import api from "./api"

export const createShortUrl = async(originalUrl: string)=>{
    const response = await api.post("/url/shorten", { originalUrl });
    return response.data;
}

export const getUserUrls=async()=>{
    const response = await api.get("/url/my-urls");
    return response.data;
}