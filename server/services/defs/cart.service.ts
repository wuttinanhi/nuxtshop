import type { ICart, IOrderItem, IProduct, IUser } from "@/types/entity";

export interface ICartService {
  createCart(cart: ICart): Promise<ICart>;
  getCart(user: IUser): Promise<ICart>;
  addToCart(user: IUser, product: IOrderItem): Promise<ICart>;
  removeFromCart(user: IUser, product: IProduct): Promise<ICart>;
  setProductQuantity(
    user: IUser,
    product: IProduct,
    quantity: number
  ): Promise<ICart>;
  clearCart(user: IUser): Promise<ICart>;
}
