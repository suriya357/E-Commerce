# ShopCart: Full-Stack E-Commerce Application 🛒

ShopCart is a modern, full-stack e-commerce web application built with Next.js for the frontend and Node.js (Express) for the backend. It features product browsing, user authentication, a persistent shopping cart, a wishlist, and a checkout process, all designed with a clean, interactive UI using shadcn/ui and animations.



## ✨ Features

* *Product Catalog:* Browse products fetched from a PostgreSQL database.
* *Shop by Category:* Filter products based on categories.
* *Product Search:* Search for products by name.
* *User Authentication:* Secure user registration and login using JWT.
* *Shopping Cart:* Add, update, and remove items from the cart. Cart persists across sessions for logged-in users using Redis.
* *Wishlist:* Logged-in users can save favorite products.
* *Checkout Process:* Simple checkout flow to simulate placing an order, saving order details to the database.
* *Responsive Design:* UI built with Tailwind CSS and shadcn/ui, adapting to mobile and desktop screens.
* *Interactive UI:* Smooth animations using Framer Motion and toast notifications using Sonner.
* *Dark Mode:* Supports light and dark themes based on user system preference or manual toggle.

## 🛠 Tech Stack

* *Frontend:*
    * Next.js (React Framework with App Router)
    * TypeScript
    * Tailwind CSS
    * shadcn/ui (Component Library)
    * Framer Motion (Animations)
    * Sonner (Toast Notifications)
    * Lucide React (Icons)
* *Backend:*
    * Node.js
    * Express.js (or NestJS as planned)
    * PostgreSQL (User, Product, Order Data)
    * Redis (Cart Persistence, Session Management planned)
    * JWT (Authentication Tokens)
    * bcryptjs (Password Hashing)
* *Database:* PostgreSQL
* *Cache:* Redis
* *Deployment (Planned):*
    * Frontend: Vercel
    * Backend/Databases: Render

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

* Node.js (v18 or later recommended)
* npm or yarn
* PostgreSQL server running locally
* Redis server running locally

### Installation & Setup

1.  *Clone the repository:*
    bash
    git clone <your-repository-url>
    cd ecommerce-project
    

2.  *Backend Setup:*
    * Navigate to the backend directory:
        bash
        cd backend
        
    * Install dependencies:
        bash
        npm install
        
    * *Set up PostgreSQL:*
        * Ensure your PostgreSQL server is running.
        * Create a database named ecommerce_db.
        * Connect to the database (e.g., using psql or pgAdmin) and run the following SQL commands to create the tables:
            sql
            -- Users Table
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Products Table
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL,
                image_url VARCHAR(255),
                category VARCHAR(255)
            );

            -- Wishlist Table
            CREATE TABLE wishlist (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );

            -- Orders Table
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_price NUMERIC(10, 2) NOT NULL,
                shipping_address TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- Order Items Table
            CREATE TABLE order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price NUMERIC(10, 2) NOT NULL
            );
            
        * (Optional but recommended) Run SQL INSERT commands to populate the products table with sample data.
    * **Create .env file:** Create a file named .env in the backend directory and add your configuration:
        env
        PORT=5000
        DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/ecommerce_db"
        REDIS_URL="redis://localhost:6379"
        JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY_FOR_JWT"
        
        Replace placeholders with your actual database credentials and a secure JWT secret.
    * *Start Redis:* Ensure your Redis server is running in the background.
    * *Start the backend server:*
        bash
        npm start
        
        The backend should now be running on http://localhost:5000.

3.  *Frontend Setup:*
    * Open a *new terminal* and navigate to the frontend directory:
        bash
        cd frontend
        
    * Install dependencies:
        bash
        npm install
        
    * **Create .env.local file:** Create a file named .env.local in the frontend directory (if it doesn't exist) and add the backend API URL:
        env
        NEXT_PUBLIC_API_URL=http://localhost:5000/api
        
    * *Add Placeholder Image:* Place a small image named placeholder-user.jpg inside the frontend/public folder for the user avatar.
    * *Start the frontend development server:*
        bash
        npm run dev
        
        The frontend should now be running on http://localhost:3000.

4.  *Access the Application:* Open your web browser and navigate to http://localhost:3000.

## ⚙ Environment Variables

* **Backend (backend/.env):**
    * PORT: Port the backend server runs on (default: 5000).
    * DATABASE_URL: Connection string for PostgreSQL.
    * REDIS_URL: Connection URL for Redis.
    * JWT_SECRET: Secret key used for signing authentication tokens.
* **Frontend (frontend/.env.local):**
    * NEXT_PUBLIC_API_URL: The base URL for the backend API.

---
