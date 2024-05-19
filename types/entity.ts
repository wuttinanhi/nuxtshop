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
  product?: IProduct;
  productId: number;
  quantity: number;
}

export interface IAddress {
  id?: number;
  addressText: string;
  city: string;
  state: string;
  zip: string;
}

export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  addressId: number;
  address?: IAddress;
  role: UserRole;
  password?: string;
  token?: string;
}

export type IUserRegister = Omit<IUser, "id" | "addressId"> & {
  password: string;
  address: IAddress;
};

export interface IUserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
  password?: string;
}

export interface ICart {
  id?: number;
  userId: number;
  user?: IUser;
  items: IOrderItem[];
}

export interface IOrder {
  id?: number;
  user: IUser;
  items: IOrderItem[];
  addressId: number;
  address?: IAddress;
  totalPrice: number;
  status: OrderStatus;
}
