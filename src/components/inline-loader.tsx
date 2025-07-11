"use client"

import Loader from "./loader"

interface InlineLoaderProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function InlineLoader({ message = "Loading...", size = "sm", className = "" }: InlineLoaderProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader size={size} message={message} />
    </div>
  )
}
