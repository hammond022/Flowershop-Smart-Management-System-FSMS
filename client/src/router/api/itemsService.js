// Moved updateItem inside ItemService class below
import api from "@/axios.js";
import { auth } from "@/auth.js";

class ItemService {
  static async updateItem(id, itemData) {
    if (!auth.can("Items", "canUpdate")) {
      throw new Error("Permission denied: cannot update items");
    }
    const res = await api.put(`/items/${id}`, itemData);
    return res.data;
  }
  static async getItems() {
    const res = await api.get("/items");
    const base = window.location.origin;
    return res.data.map((item) => ({
      ...item,
      photo: item.photo?.startsWith("/uploads/")
        ? `${base}${item.photo}`
        : item.photo,
    }));
  }

  static async getItem(id) {
    const res = await api.get(`/items/${id}`);
    return res.data;
  }

  static async createItem(itemData) {
    if (!auth.can("Items", "canCreate")) {
      throw new Error("Permission denied: cannot create items");
    }
    const res = await api.post("/items", itemData);
    return res.data;
  }

  static async updateItemStock(id, stock) {
    if (!auth.can("Items", "canUpdate")) {
      throw new Error("Permission denied: cannot update items");
    }
    const res = await api.put(`/items/${id}`, { stock });
    return res.data;
  }

  static async deleteItem(id) {
    if (!auth.can("Items", "canDelete")) {
      throw new Error("Permission denied: cannot delete items");
    }
    const res = await api.delete(`/items/${id}`);
    return res.data;
  }

  static async uploadPhoto(photoFile) {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  }
}

export default ItemService;
