import api from "@/axios.js";
import { API_BASE_URL } from "@/api/base.js";
const API_BASE = `${API_BASE_URL}/bouquets`;

export default {
  async suggest(theme, options = {}) {
    const res = await api.post(`${API_BASE}/suggest`, {
      theme,
      ...options,
    });
    return res.data;
  },

  async getTemplates() {
    const res = await api.get(`${API_BASE}/templates`);
    return res.data;
  },

  async suggestDirect(theme, itemCount = 5) {
    const res = await api.post(`${API_BASE}/suggest-direct`, {
      theme,
      itemCount,
    });
    return res.data;
  },

  async feedback(templateId, rating, notes = "") {
    const res = await api.post(`${API_BASE}/feedback`, {
      templateId,
      rating,
      notes,
    });
    return res.data;
  },
};
