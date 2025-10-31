import axios from "axios";

const API_BASE = "http://localhost:3000/api";

class ItemService {
  static async getItems() {
    const res = await axios.get(`${API_BASE}/items`);
    const base = window.location.origin;
    return res.data.map((item) => ({
      ...item,
      photo: item.photo?.startsWith("/uploads/")
        ? `${base}${item.photo}`
        : item.photo,
    }));
  }

  static async getItem(id) {
    const res = await axios.get(`${API_BASE}/items/${id}`);
    return res.data;
  }

  static async createItem({
    name,
    price,
    cost,
    category,
    description,
    tags = [],
    stock,
    photo,
  }) {
    const res = await axios.post(`${API_BASE}/items`, {
      name,
      price,
      cost,
      category,
      description,
      tags,
      stock,
      photo,
    });
    return res.data;
  }

  static async updateItemStock(id, stock) {
    const res = await axios.put(`${API_BASE}/items/${id}`, { stock });
    return res.data;
  }

  static async deleteItem(id) {
    const res = await axios.delete(`${API_BASE}/items/${id}`);
    return res.data;
  }

  static async uploadPhoto(photoFile) {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const res = await axios.post(`${API_BASE}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }
}

export default ItemService;
