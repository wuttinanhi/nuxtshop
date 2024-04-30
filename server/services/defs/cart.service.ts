import { Product } from "~/types/entity";
import { Cart, OrderItem, User } from "~/types/general";

export interface ICartService {
  createCart(cart: Cart): Promise<Cart>;
  getCart(user: User): Promise<Cart>;
  addToCart(user: User, product: OrderItem): Promise<Cart>;
  removeFromCart(user: User, product: Product): Promise<Cart>;
  setProductQuantity(
    user: User,
    product: Product,
    quantity: number
  ): Promise<Cart>;
  clearCart(user: User): Promise<Cart>;
}
