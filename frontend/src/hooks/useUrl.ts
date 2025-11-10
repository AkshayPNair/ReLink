import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { createShortUrl as createUrl, getUserUrls as getUrls, deleteUrl as deleteUrlApi } from "../api/urlService"

interface IUrl {
    _id?: string
    id?: string
    shortId: string
    originalUrl: string
    createdAt: string
}

export const useUrl = () => {
    const [urls, setUrls] = useState<IUrl[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchUrls = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getUrls()
            setUrls(data)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to load URLs"
            setError(errorMsg)
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    const createShortUrl = async (originalUrl: string) => {
        try {
            setLoading(true)
            setError(null)
            const response = await createUrl(originalUrl)
            setUrls((prev) => [response.data, ...prev])
            toast.success("URL shortened successfully!", {
                position: "top-right",
                autoClose: 3000,
            })
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to create short URL"
            setError(errorMsg)
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    const deleteUrl=async (shortId:string)=>{
        try {
            setLoading(true);
            setError(null);
            await deleteUrlApi(shortId);
            setUrls((prev) => prev.filter((url) => url.shortId !== shortId));
            toast.success("URL deleted successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to delete URL";
            setError(errorMsg);
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUrls()
    }, [])

    return {
        urls,
        loading,
        error,
        createShortUrl,
        fetchUrls,
        deleteUrl
    }
}
