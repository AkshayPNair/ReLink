import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { register as registerService, login as loginService } from "../api/authService"

export const useAuth = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const register = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
        try {
            setLoading(true)
            setError(null)
            const response = await registerService(data)
            console.log(response)
            toast.success("Registration successful! Please log in.", {
                position: "top-right",
                autoClose: 3000,
            })
            navigate("/login")
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || "Registration failed"
            setError(errorMsg)
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    const login = async (data: { email: string; password: string }) => {
        try {
            setLoading(true)
            setError(null)
            const response = await loginService(data)
            localStorage.setItem("accessToken", response.accessToken)
            toast.success("Login successful! Welcome back.", {
                position: "top-right",
                autoClose: 3000,
            })
            navigate("/dashboard")
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err?.message || "Login failed"
            setError(errorMsg)
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 3000,
            })
        } finally {
            setLoading(false)
        }
    }

    return { register, login, loading, error }
}
