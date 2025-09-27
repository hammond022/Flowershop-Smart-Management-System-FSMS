Pos System
- Add/Edit/Remove products from current order ✅
- Modify quantity ✅
- Customer notes per product order ✅
- Save order for later (draft) 
- Action history (shows edits, void, time taken per action during the order process)
- Void whole order (depends on user permission)
- Create custom product on the fly for the current order (Create a product that doesn’t exist from the inventory)
- Modify product price on the fly
- Add discounts and tax
- Products sorted by category ✅
- Out of stock warning (shows impossible order due to stock quantity)
- Create custom bouquet by mood/theme (pulls tags from inventory items and combines them together)

Inventory System
- Automatic stock counting from POS orders
- Create a product ✅
- Set product price per quantity (bundles)
- Create a category
- Track stock quantity
- Export to spreadsheet
- Add tags to products
- Low stock warning
- Stock histogram (shows product sold per day/month)
- Shows product edit action history

Settings
- Add/Edit/Delete users
- User permissions per actions (permissions to void, edit products,manage POS,manage inventory)



<details>

<summary>Backend Routes</summary>

| HTTP Method  | Endpoint | Description | Request Body (JSON) | Response Example |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Items |
| GET  | /api/items/  | Get all items  | Content Cell  | Content Cell  |
| POST  | /api/items/ | Create item  | name, quantity, price, tags = []  | Content Cell  |
| GET  | /api/items/:id  | Get item by id  | Content Cell  | Content Cell  |
| Orders |
| GET  | /api/orders/  | Get all orders  | Content Cell  | Content Cell  |
| POST  | /api/orders/  | Create order  | Content Cell  | Content Cell  |
| GET  | /api/orders/:id  | Get order by id  | Content Cell  | Content Cell  |

</details>
