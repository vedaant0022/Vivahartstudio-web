import { useEffect, useState } from "react"
import logo from "../assets/image/logo1.png"

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  message?: string
  showMessage?: boolean
  className?: string
}

export default function Loader({
  size = "md",
  message = "Loading...",
  showMessage = true,
  className = "",
}: LoaderProps) {
  const [dots, setDots] = useState("")

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Logo with animated effects */}
      <div className="relative mb-6">
        {/* Outer rotating ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin absolute inset-0`}
        ></div>

        {/* Inner pulsing ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-orange-300 rounded-full animate-pulse absolute inset-0`}
        ></div>

        {/* Logo container */}
        <div
          className={`${sizeClasses[size]} bg-white rounded-full shadow-lg flex items-center justify-center relative z-10 p-2`}
        >
          <div className="relative w-full h-full">
            <img
              src={logo} // Replace with your actual logo path
              alt="Vivah Art Studio Logo"
              className="object-contain animate-pulse"
              
            />
          </div>
        </div>

        {/* Glowing effect */}
        <div
          className={`${sizeClasses[size]} bg-gradient-to-r from-amber-400 to-orange-400 rounded-full absolute inset-0 opacity-20 animate-ping`}
        ></div>
      </div>

      {/* Loading message */}
      {showMessage && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-semibold text-amber-800 mb-2`}>
            {message}
            {dots}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
    </div>
  )
}
