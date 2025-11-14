import type { InjectionKey } from "vue";
import type {
  ICart,
  IProduct,
  IUser,
  IUserInfo,
  IUserRegister,
} from "~/types/entity";

export const KEY_USER = Symbol("KEY_USER") as InjectionKey<{
  user: Ref<IUser | undefined>;
  token: Ref<string | undefined>;
  login: (
    email: string,
    password: string,
    turnstileAnswer?: string
  ) => Promise<void>;
  register: (data: IUserRegister) => Promise<void>;
  updateInfo: (data: IUserInfo) => Promise<void>;
  logout: () => void;
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

export const ADMIN_REFRESH = Symbol("ADMIN_REFRESH") as InjectionKey<{
  refresh: () => void;
}>;
