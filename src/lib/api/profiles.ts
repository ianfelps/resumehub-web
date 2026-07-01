import { api } from "@/lib/api/client";
import type {
  ProfileItemsRequest,
  ProfileItemsResponse,
  ProfileRequest,
  ProfileResponse,
} from "@/lib/types";

export const profilesApi = {
  list: async (): Promise<ProfileResponse[]> => {
    const { data } = await api.get<ProfileResponse[]>("/profiles");
    return data;
  },
  get: async (id: string): Promise<ProfileResponse> => {
    const { data } = await api.get<ProfileResponse>(`/profiles/${id}`);
    return data;
  },
  create: async (body: ProfileRequest): Promise<ProfileResponse> => {
    const { data } = await api.post<ProfileResponse>("/profiles", body);
    return data;
  },
  update: async (id: string, body: ProfileRequest): Promise<ProfileResponse> => {
    const { data } = await api.put<ProfileResponse>(`/profiles/${id}`, body);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/profiles/${id}`);
  },
  getItems: async (id: string): Promise<ProfileItemsResponse> => {
    const { data } = await api.get<ProfileItemsResponse>(`/profiles/${id}/items`);
    return data;
  },
  setItems: async (id: string, body: ProfileItemsRequest): Promise<void> => {
    await api.put(`/profiles/${id}/items`, body);
  },
};
