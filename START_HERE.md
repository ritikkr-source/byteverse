# ByteVerse - Smart Inventory System Setup Guide

## Overview
ByteVerse is a complete inventory management system with dashboard, analytics, inventory management, and AI chat features.

## Database Setup (Supabase)

The system uses Supabase (PostgreSQL) as the backend. Your Supabase project is already configured in `js/supabase.js`.

### Required Tables

Create these two tables in your Supabase project:

#### 1. `owners` Table
```sql
CREATE TABLE owners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  shop_name TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `products` Table
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stock INT DEFAULT 0,
  cost DECIMAL(10,2),
  selling DECIMAL(10,2),
  expiry DATE,
  sold INT DEFAULT 0,
  profit DECIMAL(10,2) DEFAULT 0,
  owner_id BIGINT REFERENCES owners(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Features

### 1. **Login & Signup** (`index.html`)
- Create new account with shop details
- Secure login with email/password
- Data stored in Supabase

### 2. **Dashboard** (`dashboard.html`)
- View total products
- Track low stock items
- Monitor total profit
- Visual stock overview with chart

### 3. **Inventory Management** (`inventory.html`)
- Add new products with:
  - Product name
  - Stock quantity
  - Cost price
  - Selling price
  - Expiry date
- Sell products (decreases stock, updates profit)
- Delete products
- Real-time table update

### 4. **Business Analytics** (`analytics.html`)
- Total products count
- Low stock alerts
- Expiring soon notifications
- Top 3 selling products
- Sales performance chart
- Profit margin trends

### 5. **AI Assistant** (`ai-chat.html`)
- Ask inventory questions
- Get AI-powered insights
- Uses OpenRouter API (GPT-3.5-turbo)
- Real-time inventory data integration

## How to Use

1. **First Time**: Click "Sign Up" and create an account
2. **Login**: Use your email and password
3. **Add Products**: Go to Inventory tab and add items
4. **Sell Products**: Click "Sell" button to decrease stock
5. **View Analytics**: Check Dashboard and Analytics pages
6. **Ask AI**: Use AI Chat to get inventory insights

## File Structure
```
byteverse/
├── index.html           (Login/Signup page)
├── dashboard.html       (Main dashboard)
├── inventory.html       (Product management)
├── analytics.html       (Business analytics)
├── ai-chat.html         (AI assistant)
├── style.css            (All styling)
└── js/
    ├── supabase.js      (Backend config)
    ├── script.js        (Auth logic)
    ├── dashboard.js     (Dashboard logic)
    ├── inventory.js     (Inventory logic)
    ├── analytics.js     (Analytics logic)
    └── ai-chat.js       (Chat logic)
```

## Key Features Implemented

✅ User authentication (Sign up & Login)
✅ Product CRUD operations (Create, Read, Update via sell, Delete)
✅ Real-time data synchronization
✅ Profit calculation
✅ Stock alerts
✅ Expiry tracking
✅ Sales analytics with charts
✅ AI-powered inventory assistant
✅ Responsive mobile design
✅ Logout functionality
✅ Data persistence with Supabase

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (PostgreSQL)
- **Charts**: Chart.js
- **AI**: OpenRouter API (GPT-3.5-turbo)

## Testing

1. Open `index.html` in a browser
2. Sign up with your details
3. Add some products
4. Sell a few items
5. Check Dashboard and Analytics
6. Ask questions to the AI

## Notes

- All data is stored in Supabase and persists across sessions
- Logout clears local storage and redirects to login
- Charts update in real-time as you add/sell products
- AI responses require stable internet connection

---

**Created for College Project - ByteVerse 2026**
