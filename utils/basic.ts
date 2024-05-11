import type { IAddress, IOrderItem } from "@/types/entity";

export function addressToString(address: IAddress) {
  if (!address) return "<no address>";
  return `${address.addressText} ${address.city} ${address.state} ${address.zip}`;
}

export function buildAuthHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token") || "",
  };
}

export function calculateTotalPrice(products: IOrderItem[]) {
  return products.reduce((acc, item) => {
    return acc + item.product!.price * item.quantity;
  }, 0);
}
