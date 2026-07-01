import { api } from "@/lib/api/client";
import type {
  AccountResponse,
  ChangePasswordRequest,
  UpdateAccountRequest,
} from "@/lib/types";

export const accountApi = {
  get: async (): Promise<AccountResponse> => {
    const { data } = await api.get<AccountResponse>("/account");
    return data;
  },
  update: async (body: UpdateAccountRequest): Promise<AccountResponse> => {
    const { data } = await api.put<AccountResponse>("/account", body);
    return data;
  },
  changePassword: async (body: ChangePasswordRequest): Promise<void> => {
    await api.put("/account/password", body);
  },
};
