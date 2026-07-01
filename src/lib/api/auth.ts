import { api } from "@/lib/api/client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/lib/types";

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", body);
  return data;
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", body);
  return data;
}
