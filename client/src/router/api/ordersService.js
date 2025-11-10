import api from "@/axios.js"; // shared axios instance with auth headers
import { auth } from "@/auth.js"; // for checking user permissions

class OrderService {
  static async getOrders(params = {}) {
    try {
      const res = await api.get("/orders", { params });
      return res.data;
    } catch (err) {
      console.error("Error fetching orders:", err);
      throw err;
    }
  }

  static async getOrder(id) {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching order ${id}:`, err);
      throw err;
    }
  }

  static async createOrder({
    orderStart,
    orderEnd,
    orderStatus,
    mop,
    selectedFlowers = [],
    actionHistory = [],
    discounts = [],
    amountPaid = 0,
    change = 0,
  }) {
    if (!auth.can("Orders", "canCreate")) {
      throw new Error("Permission denied: cannot create orders");
    }

    try {
      const res = await api.post("/orders", {
        orderStart,
        orderEnd,
        orderStatus,
        mop,
        selectedFlowers,
        discounts,
        actionHistory,
        amountPaid,
        change,
      });
      return res.data;
    } catch (err) {
      console.error("Error creating order:", err);
      throw err;
    }
  }

  static async updateOrder(id, updatedData) {
    if (!auth.can("Orders", "canUpdate")) {
      throw new Error("Permission denied: cannot update orders");
    }

    try {
      const res = await api.put(`/orders/${id}`, updatedData);
      return res.data;
    } catch (err) {
      console.error(`Error updating order ${id}:`, err);
      throw err;
    }
  }

  static async deleteOrder(id) {
    if (!auth.can("Orders", "canDelete")) {
      throw new Error("Permission denied: cannot delete orders");
    }

    try {
      const res = await api.delete(`/orders/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error deleting order ${id}:`, err);
      throw err;
    }
  }
}

export default OrderService;
