import axios from "axios";
const baseURL = "http://localhost:3000/api/items/";

// should this be in a try catch??/

class ItemService {
  // GET all items
  static async getItems() {
    const res = await axios.get(baseURL);
    return res.data;
  }

  //GET item by ID
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
  }) {
    const res = await axios.post(baseURL, {
      name,
      price,
      cost,
      category,
      description,
      tags,
      stock,
    });
    return res.data;
  }

  // PUT update a user
  static async updateUser(id, name) {
    const res = await axios.put(`${baseURL}${id}`, { name });
    return res.data;
  }

  // DELETE remove a user
  static async deleteUser(id) {
    await axios.delete(`${baseURL}${id}`);
    return true;
  }
}

export default ItemService;
