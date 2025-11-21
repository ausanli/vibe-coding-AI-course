"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed right-0 bottom-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:right-0 sm:bottom-0 md:max-w-[420px]">
      {toasts?.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
