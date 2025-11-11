import api from "@/axios.js"; // shared axios instance with auth headers
import { auth } from "@/auth.js"; // for permission checking

class PurchaseOrderService {
  static async getPurchaseOrders() {
    try {
      const res = await api.get("/purchaseOrders");
      return res.data;
    } catch (err) {
      console.error("Error fetching purchase orders:", err);
      throw err;
    }
  }

  static async getPurchaseOrder(id) {
    try {
      const res = await api.get(`/purchaseOrders/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching purchase order ${id}:`, err);
      throw err;
    }
  }

  static async createPurchaseOrder({ supplier, items }) {
    if (!auth.can("PurchaseOrders", "canCreate")) {
      throw new Error("Permission denied: cannot create purchase orders");
    }

    try {
      const res = await api.post("/purchaseOrders", { supplier, items });
      return res.data;
    } catch (err) {
      console.error("Error creating purchase order:", err);
      throw err;
    }
  }

  static async updatePurchaseOrder(id, data) {
    if (!auth.can("PurchaseOrders", "canUpdate")) {
      throw new Error("Permission denied: cannot update purchase orders");
    }

    try {
      const res = await api.put(`/purchaseOrders/${id}`, data);
      return res.data;
    } catch (err) {
      console.error(`Error updating purchase order ${id}:`, err);
      throw err;
    }
  }

  static async deletePurchaseOrder(id) {
    if (!auth.can("PurchaseOrders", "canDelete")) {
      throw new Error("Permission denied: cannot delete purchase orders");
    }

    try {
      const res = await api.delete(`/purchaseOrders/${id}`);
      return res.data;
    } catch (err) {
      console.error(`Error deleting purchase order ${id}:`, err);
      throw err;
    }
  }
}

export default PurchaseOrderService;
