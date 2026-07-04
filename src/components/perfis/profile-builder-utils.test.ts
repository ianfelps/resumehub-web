import { describe, expect, it } from "vitest";
import {
  buildPublicLink,
  orderSelectedFirst,
  reorderIds,
} from "./profile-builder-utils";

describe("profile builder utils", () => {
  it("reorders selected ids by drag source and drop target", () => {
    expect(reorderIds(["a", "b", "c"], "c", "a")).toEqual(["c", "a", "b"]);
    expect(reorderIds(["a", "b", "c"], "a", "c")).toEqual(["b", "c", "a"]);
  });

  it("keeps the same array reference for invalid reorder operations", () => {
    const ids = ["a", "b", "c"];

    expect(reorderIds(ids, "x", "a")).toBe(ids);
    expect(reorderIds(ids, "b", "b")).toBe(ids);
  });

  it("builds an encoded public portfolio link", () => {
    expect(buildPublicLink("https://resumehub.app/", "front end")).toBe(
      "https://resumehub.app/p/front%20end",
    );
  });

  it("orders selected items first using the saved selection order", () => {
    const items = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

    expect(orderSelectedFirst(items, ["c", "a"]).map((item) => item.id)).toEqual([
      "c",
      "a",
      "b",
      "d",
    ]);
  });
});
