import api from "@/axios.js";
import { API_BASE_URL } from "@/api/base.js";
import { resolveBackendOrigin } from "@/api/base.js";

const API_BASE = `${API_BASE_URL}/custom-bouquets`;

export default {
  // Get all custom bouquets
  async getCustomBouquets() {
    const res = await api.get(API_BASE);
    const origin = resolveBackendOrigin();
    return res.data.map((b) => ({
      ...b,
      thumbnail: b.thumbnail?.startsWith("/uploads/")
        ? `${origin}${b.thumbnail}`
        : b.thumbnail,
    }));
  },

  // Get a specific custom bouquet
  async getCustomBouquet(id) {
    const res = await api.get(`${API_BASE}/${id}`);
    const b = res.data;
    const origin = resolveBackendOrigin();
    return {
      ...b,
      thumbnail: b.thumbnail?.startsWith("/uploads/")
        ? `${origin}${b.thumbnail}`
        : b.thumbnail,
    };
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
