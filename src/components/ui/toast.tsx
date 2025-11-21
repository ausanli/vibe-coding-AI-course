"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "success" | "error"
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type ToastActionElement = React.ReactElement

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, variant = "success", open, onOpenChange }, ref) => {
    const [isVisible, setIsVisible] = React.useState(open)

    React.useEffect(() => {
      setIsVisible(open)
    }, [open])

    React.useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          handleClose()
        }, 3000)

        return () => clearTimeout(timer)
      }
    }, [isVisible])

    const handleClose = () => {
      setIsVisible(false)
      onOpenChange?.(false)
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className="pointer-events-auto relative flex w-full max-w-md items-start gap-3 rounded-lg border p-4 shadow-lg"
        style={{
          backgroundColor: "#161618",
          borderColor: "#2E2E2E",
        }}
      >
        {/* Close button - top-left */}
        <button
          onClick={handleClose}
          className="absolute left-3 top-3 rounded-sm opacity-70 transition-opacity hover:opacity-100"
          style={{ color: "#797979" }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon container */}
        <div className="flex-shrink-0 pt-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: "#28282B",
              borderColor: "#2E2E2E",
            }}
          >
            <div
              className={cn("flex h-6 w-6 items-center justify-center rounded-full")}
              style={{
                backgroundColor: variant === "success" ? "#1DC91D" : "#EF4444",
              }}
            >
              {variant === "success" ? (
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="flex-1 pt-6">
          {title && <div className="text-sm font-medium text-white">{title}</div>}
          {description && (
            <div className="mt-1 text-sm" style={{ color: "#797979" }}>
              {description}
            </div>
          )}
        </div>
      </div>
    )
  },
)

Toast.displayName = "Toast"

export { Toast }
