import axios from "axios";
const API_BASE = "http://localhost:3000/api/bouquets";

export default {
  async suggest(theme, options = {}) {
    const res = await axios.post(`${API_BASE}/suggest`, {
      theme,
      ...options,
    });
    return res.data;
  },

  async suggestDirect(theme, itemCount = 5) {
    const res = await axios.post(`${API_BASE}/suggest-direct`, {
      theme,
      itemCount,
    });
    return res.data;
  },

  async feedback(templateId, rating, notes = "") {
    const res = await axios.post(`${API_BASE}/feedback`, {
      templateId,
      rating,
      notes,
    });
    return res.data;
  },
};
