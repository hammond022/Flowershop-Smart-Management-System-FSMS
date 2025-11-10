// UsersService.js
import api from "@/axios.js";
import { auth } from "@/auth.js";

class UsersService {
  static _checkAdmin() {
    if (!auth.user?.role?.admin?.isAdmin) {
      throw new Error("Permission denied: admin only");
    }
  }

  static async getUsers() {
    this._checkAdmin();
    const res = await api.get("/users");
    return res.data.map(({ password, ...rest }) => rest);
  }

  static async getUser(id) {
    this._checkAdmin();
    const res = await api.get(`/users/${id}`);
    const { password, ...safeUser } = res.data;
    return safeUser;
  }

  static async createUser(userData) {
    this._checkAdmin();
    const res = await api.post("/users", userData);
    const { password, ...safeUser } = res.data;
    return safeUser;
  }

  static async updateUser(id, userData) {
    this._checkAdmin();
    const res = await api.put(`/users/${id}`, userData);
    const { password, ...safeUser } = res.data;
    return safeUser;
  }

  static async deleteUser(id) {
    this._checkAdmin();
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }

  // ✅ NEW: Update user permissions
  static async updateUserPermissions(id, permissions) {
    this._checkAdmin();
    const res = await api.put(`/users/${id}`, { role: permissions });
    return res.data;
  }
}

export default UsersService;
