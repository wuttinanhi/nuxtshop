export interface CartModifyRequest {
  mode: "add" | "remove" | "set";
  productID: number;
  quantity: number;
}

export type AdminProductFormMode = "create" | "update";

export type WithTurnstile<T> = T & {
  turnstileAnswer: string;
};
