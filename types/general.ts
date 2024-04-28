export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageURL: string;
}

export interface Cart {
  user: User;
  products: OrderItem[];
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "wait_for_payment"
  | "preparing"
  | "shipping"
  | "delivered"
  | "canceled";

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  address: Address;
  totalPrice: number;
  status: OrderStatus;
}

export interface CartModifyRequest {
  mode: "add" | "remove" | "set";
  productID: number;
  quantity: number;
}
