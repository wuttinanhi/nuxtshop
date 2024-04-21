export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageURL: string;
}

export interface Cart {
    products: Product[];
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

export interface OrderItem extends Product {
    quantity: number;
}

export interface Order {
    id: number;
    user: User;
    items: OrderItem[];
    address: Address;
    totalPrice: number;
    status: 'wait_for_payment' | 'preparing' | 'shipping' | 'delivered' | 'canceled';
}
