# 💐 Flowershop Smart Management System (FSMS)

**Version 1.0.0** | Production Release

A comprehensive POS and Inventory Management solution for retail florists — featuring real-time inventory tracking, AI-powered custom bouquet suggestions, and robust user role management.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- SQLite (for data storage)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/hammond022/Flowershop-Smart-Management-System--FSMS-.git
cd ITPM_Inventory_system

# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Start the development server
npm run dev

# Build for production
npm run dist
```

The application will be available at `http://localhost:5173` (client) and `http://localhost:3000` (server).

---

## ✨ Features

### 📱 Point of Sale (POS) System
- **Order Management**: Add, edit, remove, and modify products with real-time stock validation
- **Pricing Control**: Dynamic pricing per quantity tier, on-the-fly price modifications
- **Discounts & Tax**: Flexible discount application and automatic tax calculation
- **Draft Orders**: Save incomplete orders for later processing
- **Custom Products**: Create non-inventory products on demand during checkout
- **Category Organization**: Products intelligently sorted by category
- **Stock Alerts**: Out-of-stock warnings prevent impossible orders
- **AI Bouquet Suggestions**: AI-powered custom bouquet recommendations based on mood/theme
- **Customer Notes**: Add per-item customer notes and special instructions

### 📦 Inventory Management
- **Automatic Stock Tracking**: Real-time stock updates from POS transactions
- **Product Management**: Create products with customizable pricing bundles
- **Categorization**: Organize products into categories with tag-based filtering
- **Stock Monitoring**: Low stock warnings and inventory alerts
- **Analytics**: Sales histograms (daily/monthly), stock utilization reports
- **Bulk Export**: Export inventory to spreadsheet formats
- **Tag System**: Semantic tagging for AI-powered recommendations

### 👥 User & Permissions Management
- **Role-Based Access Control**: Admin, Manager, and Clerk roles
- **Action Permissions**: Granular control over void, edit, and management actions
- **User Management**: Add, edit, and delete users (admin only)
- **Password Security**: Secure password change and confirmation mechanisms
- **Account Deletion Protocol**: Admin-confirmed account deletion with password verification

### 🤖 AI & Recommendations
- **Semantic Search**: AI embeddings for accurate flower matching
- **Template-Based Suggestions**: Pre-built bouquet templates with performance tracking
- **Confidence Scoring**: Match confidence and item-level scoring
- **User Feedback Loop**: Learn from user ratings to improve suggestions
- **Performance Monitoring**: Real-time system health and cache status

---

## 📊 Implementation Status

### ✅ Completed Features

**Point of Sale:**
- ✅ Add/Edit/Remove products from current order
- ✅ Modify quantity and pricing
- ✅ Customer notes per product order
- ✅ Save order for later (draft)
- ✅ Void whole order (permission-based)
- ✅ Create custom products on-the-fly
- ✅ Dynamic price modifications
- ✅ Discounts and tax calculation
- ✅ Category-based product organization
- ✅ Out-of-stock warnings
- ✅ AI-powered bouquet suggestions

**Inventory System:**
- ✅ Automatic stock counting from POS orders
- ✅ Product creation and management
- ✅ Bundle pricing by quantity
- ✅ Category management
- ✅ Real-time stock tracking
- ✅ Export to spreadsheet
- ✅ Product tagging system
- ✅ Low stock warnings
- ✅ Sales analytics (daily/monthly histograms)

**User & Settings:**
- ✅ User account management
- ✅ Role-based permissions (Admin, Manager, Clerk)
- ✅ Permission-based action control
- ✅ Secure password management
- ✅ Admin-confirmed account deletion---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Items Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/items/` | Retrieve all inventory items |
| `POST` | `/items/` | Create a new item |
| `GET` | `/items/:id` | Get item by ID |

**Example POST Request:**
```json
{
  "name": "Red Rose",
  "quantity": 50,
  "price": 5.99,
  "category": "Flowers",
  "tags": ["red", "romantic", "classic"]
}
```

### Orders Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/orders/` | Retrieve all orders |
| `POST` | `/orders/` | Create a new order |
| `GET` | `/orders/:id` | Get order by ID |

**Example POST Request:**
```json
{
  "items": [1, 2, 3],
  "notes": "Deliver to Main St",
  "discount": 0.1,
  "tax": 0.08
}
```

### AI Bouquet Suggestion Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/bouquets/suggest` | Generate AI-powered bouquet recommendations |
| `GET` | `/bouquets/status` | Check system health and AI model status |
| `POST` | `/bouquets/feedback` | Submit user feedback for template improvement |

**POST /bouquets/suggest Request:**
```json
{
  "theme": "romantic",
  "excludeIds": ["item-5"],
  "preferredId": "item-1"
}
```

**POST /bouquets/suggest Response (200):**
```json
{
  "theme": "romantic",
  "template": {
    "id": "template-001",
    "name": "Enchanted Romance",
    "theme": "romantic",
    "themeTags": ["love", "elegance", "passion"]
  },
  "matchingAnalysis": {
    "method": "semantic",
    "templateConfidence": "94%",
    "averageItemConfidence": "88%",
    "processingTime": "245ms",
    "matchingEngine": "AI Semantic + Keyword"
  },
  "financials": {
    "totalCost": 28.50,
    "totalPrice": 85.00,
    "profitMargin": 56.50,
    "profitMarginPercentage": "66.5%",
    "recommendedPrice": 89.99
  },
  "composition": {
    "totalItems": 4,
    "totalQuantity": 25,
    "uniqueFlowers": 4
  },
  "items": [
    {
      "id": "1",
      "name": "Red Rose",
      "quantity": 12,
      "price": 2.00,
      "totalPrice": 24.00,
      "matchingAnalysis": {
        "overallConfidence": "96%",
        "matchReasons": ["primary color", "romantic symbol"]
      }
    }
  ],
  "metadata": {
    "generatedAt": "2024-12-06T10:30:00Z",
    "systemVersion": "1.0.0"
  }
}
```

**Error Responses:**
- `400`: Invalid theme or request body
- `404`: No templates found for requested theme
- `429`: System busy with other requests
- `500`: Internal server error

### Users Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/` | Get all users (admin only) |
| `POST` | `/users/` | Create a new user (admin only) |
| `PUT` | `/users/:id` | Update user (admin only) |
| `DELETE` | `/users/:id` | Delete user (admin only) |

**User Deletion Protocol:**
- Only administrators can delete accounts
- Admin must re-enter their password to confirm deletion
- Admin cannot delete their own account
- Success returns HTTP 204 (no content)

**Error Codes:**
- `400`: Missing password in request
- `401`: Password incorrect
- `403`: Insufficient permissions or self-deletion attempt
- `404`: User not found

---

