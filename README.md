# 💐 POS & Inventory Management System

A modern POS and Inventory Management solution for managing retail and floral shop workflows — including product management, custom bouquets, and real-time stock tracking.

---
## TODO

POS System

| Feature | Status |
|----------|:------:|
| Add/Edit/Remove products from current order | ✅ |
| Modify quantity | ✅ |
| Customer notes per product order | ✅ |
| Save order for later (draft) | ✅ |
| Action history (shows edits, voids, and time taken per action) | 🚧 In Progres |
| Void whole order (depends on user permission) | ✅ |
| Create custom product on the fly (not from inventory) | ❌ Cancelled |
| Modify product price on the fly | ✅ |
| Add discounts and tax | ✅ |
| Products sorted by category | ✅ |
| Out of stock warning (impossible order due to stock) | ✅ |
| Create custom bouquet by mood/theme (pulls tags from inventory) | 🚧 In Progress |


Inventory System

| Feature | Status |
|----------|:------:|
| Automatic stock counting from POS orders | ✅ |
| Create a product | ✅ |
| Set product price per quantity (bundles) | ❌ Cancelled |
| Create a category | ✅ |
| Track stock quantity | ✅ |
| Export to spreadsheet | ✅ |
| Add tags to products | ✅ |
| Low stock warning | ✅ |
| Stock histogram (sales per day/month) | ❌ Cancelled (turned in sales histogram) |
| Product edit action history | ❌ Cancelled |



Settings

| Feature | Status |
|----------|:------:|
| Add/Edit/Delete users | 🚧 In Progress |
| User permissions per action (void, edit, manage POS/inventory) | 🚧 In Progress |

---

## Legend

| Icon | Meaning |
|------|----------|
| ✅ | Completed |
| 🚧 | In Progress |
| ❌ | Cancelled |


---


⚙️ Backend Routes



###  **Items**

| HTTP Method | Endpoint | Description | Request Body (JSON) | Response Example |
|--------------|-----------|--------------|----------------------|------------------|
| **GET** | `/api/items/` | Get all items | — | `[ { "id": 1, "name": "Rose", "quantity": 50, "price": 5.99 } ]` |
| **POST** | `/api/items/` | Create item | `{ "name": "Rose", "quantity": 50, "price": 5.99, "tags": ["flower", "bouquet"] }` | `{ "id": 1, "name": "Rose", "quantity": 50, "price": 5.99, "tags": ["flower", "bouquet"] }` |
| **GET** | `/api/items/:id` | Get item by ID | — | `{ "id": 1, "name": "Rose", "quantity": 50, "price": 5.99 }` |

---

###  **Orders**

| HTTP Method | Endpoint | Description | Request Body (JSON) | Response Example |
|--------------|-----------|--------------|----------------------|------------------|
| **GET** | `/api/orders/` | Get all orders | — | `[ { "id": 101, "items": [1, 2], "total": 25.50 } ]` |
| **POST** | `/api/orders/` | Create order | `{ "items": [1, 2], "notes": "For delivery", "discount": 0.1 }` | `{ "id": 101, "status": "pending", "total": 25.50 }` |
| **GET** | `/api/orders/:id` | Get order by ID | — | `{ "id": 101, "items": [1, 2], "total": 25.50 }` |
 
 .