import type { Address, OrderItem } from "~/types/general";

export function addressToString(address: Address) {
  return `${address.address} ${address.city} ${address.state} ${address.zip}`;
}

export function buildAuthHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token") || "",
  };
}

export function calculateTotalPrice(products: OrderItem[]) {
  return products.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
}
