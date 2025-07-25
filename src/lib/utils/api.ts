import { toast } from "react-toastify"

export type ApiResponse<T> = {
  data?: T
  error?: Error | string
  status?: "success" | "error"
}

export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  {
    loadingMessage = "Loading...",
    successMessage = "Operation successful!",
    errorMessage = "An error occurred",
  }: {
    loadingMessage?: string
    successMessage?: string
    errorMessage?: string
  } = {}
): Promise<ApiResponse<T>> {
  const toastId = toast.loading(loadingMessage)
  let data: T
  try {
    data = await apiCall()
    toast.update(toastId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    })
    return { data, status: "success" }
  } catch (error) {
    toast.update(toastId, {
      render: data?.error?.message,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    })
    return { error: error instanceof Error ? error : new Error(data.error.message), status: "error" }
  }
} 