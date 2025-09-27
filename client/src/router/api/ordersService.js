import axios from "axios";
const baseURL = "http://localhost:3000/api/orders/";

// same thing with itemService.js idk if this should be in a trycatch
// if something happens definitely try adding a trycatch first to see the error

class OrderService {
  static async getOrders() {
    const res = await axios.get(baseURL);
    return res.data;
  }

  static async getOrder(id) {
    const res = await axios.get(`${baseURL}${id}`);
    return res.data;
  }

  static async createOrder({
    orderStart,
    orderEnd,
    orderStatus,
    selectedFlowers = [],
    actionHistory = [],
  }) {
    const res = await axios.post(baseURL, {
      orderStart,
      orderEnd,
      orderStatus,
      selectedFlowers,
      actionHistory,
    });
    return res.data;
  }
}

export default OrderService;
