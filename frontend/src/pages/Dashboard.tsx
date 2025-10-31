import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUrl } from "../hooks/useUrl"
import { Link2, LogOut, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from "react-toastify"

export default function Dashboard() {
    const navigate = useNavigate()
    const [url, setUrl] = useState('')
    const { urls, loading, error, createShortUrl } = useUrl()
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ?? ""
    const shortUrlBase = apiBaseUrl
        ? (apiBaseUrl.endsWith("/api") ? `${apiBaseUrl}/url` : `${apiBaseUrl}/api/url`)
        : `${window.location.origin}/api/url`
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 5
    const totalPages = Math.ceil(urls.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedUrls = urls.slice(startIndex, startIndex + pageSize)

    const handleSignOut = () => {
        localStorage.removeItem("accessToken")
        navigate('/login')
    }



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!url.trim()) {
            return
        }

        const urlPattern = /^(https?:\/\/)/
        let formattedUrl = urlPattern.test(url) ? url : `https://${url}`

        if (!urlPattern.test(url)) {
            const urlWithoutProtocol = formattedUrl.replace(/^https?:\/\//, '')
            if (!urlWithoutProtocol.includes('.')) {
                toast.error("Please enter a valid domain with a proper format (e.g., example.com)", {
                    position: "top-right",
                    autoClose: 3000,
                })
                return
            }
        }


        await createShortUrl(formattedUrl)
        setUrl("")
        setCurrentPage(1)
    }

    const copyToClipboard = async (shortCode: string, id: string) => {
        const shortUrl = `${window.location.origin}/${shortCode}`
        await navigator.clipboard.writeText(shortUrl)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/30">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">ReLink</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">URL Shortener</h1>
                    <p className="text-slate-600">Create short, memorable links in seconds</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
                                Enter your long URL
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    id="url"
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/your-long-url"
                                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-100"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !url.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap"
                                >
                                    {loading ? 'Shortening...' : 'Shorten URL'}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Your Links</h2>
                        <span className="text-sm text-slate-500">{urls.length} total</span>
                    </div>

                    {urls.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
                                <Link2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600">No shortened URLs yet</p>
                            <p className="text-sm text-slate-500 mt-1">Create your first short link above</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {paginatedUrls.map((item) => {
                                    const shortUrl = `${shortUrlBase}/${item.shortId}`
                                    return (
                                        <div
                                            key={item._id}
                                            className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <a
                                                            href={shortUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-700 font-medium truncate flex items-center space-x-1 group"
                                                        >
                                                            <span className="truncate">{shortUrl}</span>
                                                            <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </a>
                                                    </div>
                                                    <p className="text-sm text-slate-600 truncate mb-2">{item.originalUrl}</p>
                                                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                        <span>{formatDate(item.createdAt)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            if (item.shortId && item._id) {
                                                                copyToClipboard(item.shortId, item._id)
                                                            }
                                                        }}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                                                    >
                                                        {copiedId === item._id ? (
                                                            <>
                                                                <Check className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Copied!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4" />
                                                                <span className="text-sm font-medium">Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="text-sm font-medium">Previous</span>
                                    </button>

                                    <span className="text-sm text-slate-600">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-sm font-medium">Next</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
