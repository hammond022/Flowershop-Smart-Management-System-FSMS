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
| Void whole order (depends on user permission) | ✅ |
| Create custom product on the fly (not from inventory) | ✅ |
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
| Set product price per quantity (bundles) | ✅ |
| Create a category | ✅ |
| Track stock quantity | ✅ |
| Export to spreadsheet | ✅ |
| Add tags to products | ✅ |
| Low stock warning | ✅ |
| Stock histogram (sales per day/month) | ✅ |



Settings

| Feature | Status |
|----------|:------:|
| Add/Edit/Delete users | ✅ |
| User permissions per action (void, edit, manage POS/inventory) | ✅ |

### User Deletion Rules

- Only admins can delete accounts.
- Admin must re-enter their own password to confirm deletion.
- An admin cannot delete their own account.
- Deletion returns HTTP 204 on success; no content body.
- Errors:
	- 400 if password missing.
	- 401 if password incorrect.
	- 403 if not admin or attempting self-deletion.
	- 404 if target user not found.

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
 
 # Bouquet Suggestion API Routes & Responses

## Route Summary Table

| Route | Method | Purpose | Request Body | Success Response | Error Responses |
|-------|---------|---------|--------------|------------------|-----------------|
| **/suggest** | POST | Generate bouquet recommendations | `{ theme: string, excludeIds?: string[], preferredId?: string }` | `200` - Bouquet suggestion with items, financials, and analysis | `400` - Invalid theme<br>`429` - System busy<br>`404` - No templates found<br>`500` - Internal error |
| **/status** | GET | Check system health & cache status | None | `200` - System status with AI, cache, and performance info | None |
| **/feedback** | POST | Submit template feedback | `{ templateId: string, rating: "up" or "down" }` | `200` - Feedback recorded with new bias score | `400` - Invalid feedback data<br>`404` - Template not found<br>`500` - Update failed |

---

## Detailed Response Structures

### POST /suggest Response
| Section | Field | Type | Description |
|---------|-------|------|-------------|
| **theme** | | string | Original requested theme |
| **template** | id | string | Template identifier |
| | name | string | Template name |
| | theme | string | Template theme |
| | themeTags | string[] | Associated tags |
| **matchingAnalysis** | method | string | "keyword" or "semantic" |
| | templateConfidence | string | Match confidence percentage |
| | averageItemConfidence | string | Average item match confidence |
| | processingTime | string | Request processing duration |
| | totalTemplatesConsidered | number | Number of templates evaluated |
| | matchingEngine | string | "AI Semantic + Keyword" or "Keyword Only" |
| **financials** | totalCost | number | Total cost of bouquet |
| | totalPrice | number | Total price of bouquet |
| | profitMargin | number | Profit amount |
| | profitMarginPercentage | number | Profit percentage |
| | recommendedPrice | number | Suggested selling price |
| **composition** | totalItems | number | Number of different flowers |
| | totalQuantity | number | Total flower quantity |
| | stockUtilization | string | "conservative" stock usage |
| | uniqueFlowers | number | Number of unique flower types |
| **items[]** | id | string | Flower item ID |
| | name | string | Flower name |
| | quantity | number | Quantity used |
| | price | number | Unit price |
| | totalPrice | number | Total price for quantity |
| | **matchingAnalysis** | object | Item-specific match details |
| | → overallConfidence | string | Match confidence percentage |
| | → scoreBreakdown | object | Detailed score breakdown |
| | → matchReasons | string[] | Reasons for match |
| **metadata** | generatedAt | string | ISO timestamp |
| | systemVersion | string | API version |
| | inventorySnapshot | string | Available flowers count |

### GET /status Response
| Section | Field | Type | Description |
|---------|-------|------|-------------|
| **status** | | string | "operational" system status |
| **ai** | embeddingsLoaded | boolean | Whether AI embeddings are loaded |
| | model | string | AI model name |
| | capabilities | string[] | Available AI capabilities |
| **cache** | templates | string | Cached templates count |
| | items | string | Cached flowers count |
| | lastUpdated | string | Last cache update timestamp |
| **performance** | concurrentRequests | number | Current active requests |
| | maxConcurrent | number | Maximum concurrent requests |

### POST /feedback Response
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Request success status |
| message | string | Feedback recording status |
| newBias | number | Updated template bias score (0-1) |
| templateId | string | Template identifier |

---

## Error Response Structure
| Field | Type | Description |
|-------|------|-------------|
| error | string | Error description |
| details | string | Detailed error message (optional) |
| timestamp | string | Error occurrence time (optional) |
| recoverySuggestion | string | Suggested recovery steps (optional) |
| suggestion | string | Alternative actions (optional) |
