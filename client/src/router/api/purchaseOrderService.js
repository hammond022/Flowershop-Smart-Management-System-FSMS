import axios from "axios";
const baseURL = "http://localhost:3000/api/purchaseOrders/";

class PurchaseOrderService {
  static async getPurchaseOrders() {
    const res = await axios.get(baseURL);
    return res.data;
  }

  static async getPurchaseOrder(id) {
    const res = await axios.get(`${baseURL}${id}`);
    return res.data;
  }

  static async createPurchaseOrder({ supplier, items }) {
    const res = await axios.post(baseURL, { supplier, items });
    return res.data;
  }

  static async deletePurchaseOrder(id) {
    const res = await axios.delete(`${baseURL}${id}`);
    return res.data;
  }
}

export default PurchaseOrderService;
