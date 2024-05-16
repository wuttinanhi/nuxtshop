import type { InjectionKey } from "vue";
import type { ICart, IProduct, IUser } from "~/types/entity";

export const KEY_USER = Symbol("KEY_USER") as InjectionKey<{
  user: Ref<IUser | undefined>;
  setUser: (user: IUser) => void;
  token: Ref<string | undefined>;
}>;

export const KEY_CART = Symbol("KEY_CART") as InjectionKey<{
  cart: Ref<ICart | null>;
  getCart: () => ICart | null;
  createOrder: () => Promise<void>;
  addToCart: (product: IProduct) => Promise<void>;
  removeAll: (product: IProduct) => Promise<void>;
  changeQuantity: (product: IProduct, quantity: number) => Promise<void>;
  totalPrice: ComputedRef<number>;
}>;
