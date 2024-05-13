export enum OrderStatus {
  WaitForPayment = "wait_for_payment",
  Preparing = "preparing",
  Shipping = "shipping",
  Delivered = "delivered",
  Canceled = "canceled",
  All = "all",
}

export function stringToOrderStatus(status: string): OrderStatus {
  switch (status) {
    case "wait_for_payment":
      return OrderStatus.WaitForPayment;
    case "preparing":
      return OrderStatus.Preparing;
    case "shipping":
      return OrderStatus.Shipping;
    case "delivered":
      return OrderStatus.Delivered;
    case "canceled":
      return OrderStatus.Canceled;
    case "all":
      return OrderStatus.All;
    default:
      throw new Error("Invalid order status");
  }
}

export function orderStatusToHuman(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.WaitForPayment:
      return "Wait for payment";
    case OrderStatus.Preparing:
      return "Preparing";
    case OrderStatus.Shipping:
      return "Shipping";
    case OrderStatus.Delivered:
      return "Delivered";
    case OrderStatus.Canceled:
      return "Canceled";
    case OrderStatus.All:
      return "All";
  }
}
