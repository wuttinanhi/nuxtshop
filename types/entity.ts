import type { OrderStatus } from "~/shared/enums/orderstatus.enum";
import type { UserRole } from "~/shared/enums/userrole.enum";

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  imageData?: any;
  __clientDeleted?: boolean;
}

export interface IOrderItem {
  id?: number;
  product: IProduct;
  quantity: number;
}

export interface IAddress {
  id?: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface IUser {
  value: IUser;
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
  role: UserRole;
  password?: string;
}

export interface ICart {
  id?: number;
  user: IUser;
  products: IOrderItem[];
}

export interface IOrder {
  id?: number;
  user: IUser;
  items: IOrderItem[];
  address: IAddress;
  totalPrice: number;
  status: OrderStatus;
}
