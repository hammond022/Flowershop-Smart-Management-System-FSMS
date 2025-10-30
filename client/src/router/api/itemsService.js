import axios from "axios";
const baseURL = "http://localhost:3000/api/items/";

class ItemService {
  // GET all items
  static async getItems() {
    const res = await axios.get(baseURL);
    return res.data;
  }

  // GET item by ID
  static async getItem(id) {
    const res = await axios.get(`${baseURL}${id}`);
    return res.data;
  }

  // POST create new item
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
    const res = await axios.post(baseURL, {
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

  // PUT update stock only (for purchase orders)
  static async updateItemStock(id, stock) {
    const res = await axios.put(`${baseURL}${id}`, { stock });
    return res.data;
  }

  // PUT update a user (this looks outdated — maybe remove later)
  static async updateUser(id, name) {
    const res = await axios.put(`${baseURL}${id}`, { name });
    return res.data;
  }

  // DELETE remove a user
  static async deleteItem(id) {
    await axios.delete(`${baseURL}${id}`);
    return true;
  }

   // POST photo upload
  static async uploadPhoto(photoFile) {
    const formData = new FormData();
    formData.append("photo", photoFile);

    const res = await axios.post("http://localhost:3000/api/upload/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.photoUrl; // the path to the uploaded image
  }
}


export default ItemService;
