import { AxiosError } from "axios";
import { toast } from "sonner";

export function handleApiError(e: unknown, fallbackMessage: string): never {
  const error = e as AxiosError<{ message?: string }>;
  const message = error?.response?.data?.message || fallbackMessage;

  toast.error(message);

  throw new Error(message);
}
