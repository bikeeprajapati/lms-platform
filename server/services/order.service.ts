import OrderModel from "../models/order.model";

// create an order and return it (used by createOrder controller)
export const newOrder = async (data: any) => {
    const order = await OrderModel.create(data);
    return order;
};

// get all orders, sorted newest first (used by getAllOrders controller)
export const getAllOrdersService = async () => {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    return orders;
};