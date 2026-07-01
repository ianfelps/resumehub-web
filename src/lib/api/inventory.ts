import { api } from "@/lib/api/client";
import type { InventoryKind, InventoryShapes } from "@/lib/types";

/**
 * Generic CRUD client for the six inventory resources, mirroring the API's
 * generic `OwnedCrudController<TRequest, TResponse>`. One implementation,
 * fully typed per `kind` through the `InventoryShapes` map.
 */

type Res<K extends InventoryKind> = InventoryShapes[K]["response"];
type Req<K extends InventoryKind> = InventoryShapes[K]["request"];

export function inventoryApi<K extends InventoryKind>(kind: K) {
  const path = `/${kind}`;
  return {
    list: async (): Promise<Res<K>[]> => {
      const { data } = await api.get<Res<K>[]>(path);
      return data;
    },
    get: async (id: string): Promise<Res<K>> => {
      const { data } = await api.get<Res<K>>(`${path}/${id}`);
      return data;
    },
    create: async (body: Req<K>): Promise<Res<K>> => {
      const { data } = await api.post<Res<K>>(path, body);
      return data;
    },
    update: async (id: string, body: Req<K>): Promise<Res<K>> => {
      const { data } = await api.put<Res<K>>(`${path}/${id}`, body);
      return data;
    },
    remove: async (id: string): Promise<void> => {
      await api.delete(`${path}/${id}`);
    },
  };
}
