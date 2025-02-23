"use client"

import { type FC } from "react"

interface LoadingIndicatorProps {
  message?: string
  className?: string
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ 
  message = "Loading articles...",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

export default LoadingIndicator