import { ErrorResponseMessage } from "@/interfaces/shared-api.interface";
import { AxiosError } from "axios";

/*
 * HELPER TO NORMALIZE ERRORS
 */

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponseMessage | undefined;

    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (
      data?.message &&
      typeof data.message === "object" &&
      "message" in data.message
    )
      return data.message.message ?? "Unknown error";

    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

export async function handleRequest<T>(
  request: Promise<{ data: T }>
): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
      console.error(message);
    if (error instanceof AxiosError) throw error;
    throw new Error(message);
  }
}
