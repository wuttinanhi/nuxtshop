import crypto from "crypto";
import {Address, DatabaseSingleton, Order, OrderItem, Product, Stock, User,} from "~/server/databases/database";
import {OrderStatus} from "~/shared/enums/orderstatus.enum";
import {ICart, IOrder, IUser} from "~/types/entity";
import {calculateTotalPrice} from "~/utils/basic";
import {IOrderFilter, IOrderService} from "../defs/order.service";

export class OrderServiceORM implements IOrderService {
    async createOrderFromCart(cart: ICart): Promise<IOrder> {
        if (cart.items.length <= 0) {
            throw new Error("Cart is empty");
        }

        const transaction = await DatabaseSingleton.getDatabase().transaction();

        try {
            const user = await User.findByPk(cart.userId, {
                include: [{model: Address, as: "address"}],
            });

            if (!user) {
                throw new Error("User not found");
            }

            const deliveryAddress = await Address.findOne({
                where: {userId: user.id},
            });
            if (!deliveryAddress) {
                throw new Error("failed to get user delivery address");
            }

            const order = await Order.create(
                {
                    status: OrderStatus.WaitForPayment,
                    totalPrice: calculateTotalPrice(cart.items),
                    UserId: user.id,
                    userId: user.id,
                    AddressId: deliveryAddress.id,
                    addressId: deliveryAddress.id,
                    deliveryAddressId: deliveryAddress.id,
                    ref_uuid: crypto.randomUUID(),
                },
                {transaction}
            );

            console.log(`preparing order #${order.id}`);

            for (const item of cart.items) {
                // check stock if available
                const stock = await Stock.findOne({
                    where: {productId: item.product!.id},
                    transaction,
                    lock: true,
                });
                if (!stock) {
                    throw new Error(`Product #${item.product!.id} not found in stock!`);
                }

                if (stock.quantity < item.quantity) {
                    throw new Error(
                        `Not enough stock for product #${item.product!.id} ${
                            item.product!.name
                        } (have ${stock.quantity})`
                    );
                }

                await OrderItem.create(
                    {
                        product: item.product,
                        quantity: item.quantity,
                        ProductId: item.product!.id,
                        productId: item.product!.id,
                        OrderId: order.id,
                        orderId: order.id,
                    },
                    {transaction}
                );

                // cut stock
                stock.quantity -= item.quantity;
                await stock.save({transaction});

                // console.log(
                //   `added order item ${item.product!.name} to order #${order.id}`
                // );
            }

            await transaction.commit();

            console.log(`created order #${order.id} with status ${order.status}`);

            return order;
        } catch (error) {
            await transaction.rollback();
            console.log("Error creating order: " + error);
            throw new Error("Failed to create order: " + error);
        }
    }

    async getOrder(id: number): Promise<IOrder | null> {
        return Order.findByPk(id, {
            include: [
                {model: User, as: "user"},
                {model: Address, as: "delivery_address"},
                {
                    model: OrderItem,
                    as: "items",
                    include: [{model: Product, as: "product"}],
                },
            ],
        });
    }

    async payForOrder(id: number): Promise<IOrder> {
        const order = (await this.getOrder(id)) as Order;
        if (!order) {
            throw new Error("Order not found");
        }

        // order status must be WaitForPayment
        if (order.status !== OrderStatus.WaitForPayment) {
            throw new Error("Order is not waiting for payment");
        }

        // update order status to preparing
        order.status = OrderStatus.Preparing;
        await order.save();

        return order;
    }

    async getOrdersForUser(user: IUser): Promise<IOrder[]> {
        return Order.findAll({
            where: {user: user},
        });
    }

    async getAllOrders(): Promise<IOrder[]> {
        return Order.findAll({
            include: [
                {model: User, as: "user"},
                {model: Address, as: "delivery_address"},
                {
                    model: OrderItem,
                    as: "items",
                    include: [{model: Product, as: "product"}],
                },
            ],
        });
    }

    async filterOrdersByStatus(status: OrderStatus): Promise<IOrder[]> {
        let whereOpts = {} as any;

        if (status && status !== OrderStatus.All) {
            whereOpts.status = status;
        }

        return Order.findAll({
            where: whereOpts,
            include: [
                {model: User, as: "user"},
                {model: Address, as: "delivery_address"},
                {
                    model: OrderItem,
                    as: "items",
                    include: [{model: Product, as: "product"}],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async filter(opts: IOrderFilter): Promise<IOrder[]> {
        let whereOpts = {} as any;

        if (opts.status && opts.status !== OrderStatus.All) {
            whereOpts.status = opts.status;
        }

        if (opts.user) {
            whereOpts.userId = opts.user.id;
        }

        const orders = await Order.findAll({
            where: whereOpts,
            include: [
                {model: User, as: "user"},
                {model: Address, as: "delivery_address"},
                {
                    model: OrderItem,
                    as: "items",
                    include: [{model: Product, as: "product"}],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return orders;
    }

    async updateOrderStatus(id: number, status: OrderStatus): Promise<IOrder> {
        const order = (await this.getOrder(id)) as Order;
        if (!order) {
            throw new Error("Order not found");
        }

        // if order status Delivered: cannot change status
        if (order.status === OrderStatus.Delivered) {
            throw new Error("Order already delivered");
        }

        order.status = status;
        await order.save();

        return order;
    }

    async received(id: number): Promise<void> {
        const order = (await this.getOrder(id)) as Order;
        if (!order) {
            throw new Error("Order not found");
        }

        // order status must be Shipping
        if (order.status !== OrderStatus.Shipping) {
            throw new Error("Order is not shipping");
        }

        order.status = OrderStatus.Delivered;
        await order.save();
    }
}
