import type { OrderStatus } from "./entity";

// add "all" to OrderStatusAdmin
export type OrderStatusAdmin = OrderStatus | "all";

export interface CartModifyRequest {
  mode: "add" | "remove" | "set";
  productID: number;
  quantity: number;
}

export type AdminProductFormMode = "create" | "update";
