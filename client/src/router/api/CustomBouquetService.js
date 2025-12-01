import api from "@/axios.js";
import { API_BASE_URL } from "@/api/base.js";

const API_BASE = `${API_BASE_URL}/custom-bouquets`;

export default {
  // Get all custom bouquets
  async getCustomBouquets() {
    const res = await api.get(API_BASE);
    return res.data;
  },

  // Get a specific custom bouquet
  async getCustomBouquet(id) {
    const res = await api.get(`${API_BASE}/${id}`);
    return res.data;
  },

  // Create a new custom bouquet
  async createCustomBouquet(bouquetData) {
    const res = await api.post(API_BASE, bouquetData);
    return res.data;
  },

  // Update an existing custom bouquet
  async updateCustomBouquet(id, bouquetData) {
    const res = await api.put(`${API_BASE}/${id}`, bouquetData);
    return res.data;
  },

  // Delete a custom bouquet
  async deleteCustomBouquet(id) {
    const res = await api.delete(`${API_BASE}/${id}`);
    return res.data;
  },
};
