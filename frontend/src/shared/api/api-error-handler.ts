import { AxiosError } from "axios";

export function handleApiError(e: unknown, fallbackMessage: string): never {
  const error = e as AxiosError<{ message?: string }>;
  const message = error?.response?.data?.message || fallbackMessage;

  throw new Error(message);
}
