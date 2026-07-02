"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { accountApi } from "@/lib/api/account";
import { inventoryApi } from "@/lib/api/inventory";
import { profilesApi } from "@/lib/api/profiles";
import { queryKeys } from "@/lib/query/query-keys";
import type {
  ChangePasswordRequest,
  DeleteAccountRequest,
  InventoryKind,
  InventoryShapes,
  ProfileItemsRequest,
  ProfileRequest,
  UpdateAccountRequest,
} from "@/lib/types";

type Req<K extends InventoryKind> = InventoryShapes[K]["request"];

// ---- Inventory ----

export function useInventory<K extends InventoryKind>(kind: K) {
  return useQuery({
    queryKey: queryKeys.inventory(kind),
    queryFn: () => inventoryApi(kind).list(),
  });
}

export function useCreateInventory<K extends InventoryKind>(kind: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Req<K>) => inventoryApi(kind).create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.inventory(kind) });
    },
  });
}

export function useUpdateInventory<K extends InventoryKind>(kind: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Req<K> }) =>
      inventoryApi(kind).update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.inventory(kind) });
    },
  });
}

export function useRemoveInventory<K extends InventoryKind>(kind: K) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryApi(kind).remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.inventory(kind) });
    },
  });
}

// ---- Profiles ----

export function useProfiles() {
  return useQuery({
    queryKey: queryKeys.profiles,
    queryFn: () => profilesApi.list(),
  });
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: queryKeys.profile(id),
    queryFn: () => profilesApi.get(id),
    enabled: Boolean(id),
  });
}

export function useProfileItems(id: string) {
  return useQuery({
    queryKey: queryKeys.profileItems(id),
    queryFn: () => profilesApi.getItems(id),
    enabled: Boolean(id),
  });
}

export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProfileRequest) => profilesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProfileRequest }) =>
      profilesApi.update(id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.profiles });
      qc.invalidateQueries({ queryKey: queryKeys.profile(data.id) });
    },
  });
}

export function useRemoveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profilesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profiles });
    },
  });
}

// ---- Account ----

export function useAccount() {
  return useQuery({
    queryKey: queryKeys.account,
    queryFn: () => accountApi.get(),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateAccountRequest) => accountApi.update(body),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.account, data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => accountApi.changePassword(body),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: DeleteAccountRequest) => accountApi.remove(body),
    onSuccess: () => qc.clear(),
  });
}

export function useSetProfileItems(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProfileItemsRequest) => profilesApi.setItems(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile(id) });
      qc.invalidateQueries({ queryKey: queryKeys.profileItems(id) });
    },
  });
}
