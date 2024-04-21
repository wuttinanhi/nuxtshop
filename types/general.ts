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

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface OrderItem extends Product {
    quantity: number;
}

export interface Order {
    id: number;
    user: User;
    items: OrderItem[];
    address: string;
    totalPrice: number;
}
