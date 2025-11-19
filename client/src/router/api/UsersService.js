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

  // Allows a user to update their own account (username/password) without admin check
  static async updateSelf(id, userData) {
    const res = await api.put(`/users/${id}`, userData);
    const { password, ...safeUser } = res.data;
    return safeUser;
  }

  static async deleteUser(id, password) {
    this._checkAdmin();
    if (!password) throw new Error("Password required to delete account");
    const res = await api.delete(`/users/${id}`, { data: { password } });
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
