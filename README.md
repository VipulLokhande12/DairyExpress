# 🥛 DairyExpress

### Full-Stack Dairy E-Commerce Platform

DairyExpress is a full-stack e-commerce web application for purchasing dairy products online. It provides product browsing, search, cart and wishlist management, coupons, checkout, delivery-slot selection, order management, PDF invoices, inventory management, and delivery tracking.

---

## 🚀 Key Features

* 🔐 User authentication with **Spring Security & JWT**
* 🛒 Product catalog, search, cart and wishlist
* 🎟️ Coupon and discount management
* 📦 Order and inventory management
* 🚚 Delivery slot selection and tracking
* 💳 Payment workflow
* 🧾 PDF invoice generation
* 🗺️ Delivery map using **Leaflet & OpenStreetMap**
* 🌐 English and Hindi language support
* 👨‍💼 Admin management features
* 📱 Responsive React.js interface

---

## 🛠️ Tech Stack

| Layer           | Technologies                             |
| --------------- | ---------------------------------------- |
| Frontend        | React.js, TypeScript, Tailwind CSS, Vite |
| Backend         | Java, Spring Boot, Spring Security       |
| Authentication  | JWT                                      |
| Database        | MySQL                                    |
| ORM             | Hibernate / JPA                          |
| API             | REST API                                 |
| Maps            | Leaflet, OpenStreetMap                   |
| Build Tools     | Maven, npm                               |
| Version Control | Git, GitHub                              |

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React.js UI     │
                    │  TypeScript + Vite  │
                    └──────────┬──────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │  REST Controllers   │
                    │  Service Layer      │
                    │  Repository Layer   │
                    └──────────┬──────────┘
                               │
                         JPA / Hibernate
                               │
                               ▼
                    ┌─────────────────────┐
                    │        MySQL        │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
DairyExpress/
│
├── DairyXpress-Backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── DairyXpress-Frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Run Locally

### Backend

```bash
cd DairyXpress-Backend
mvn clean install
mvn spring-boot:run
```

Configure your MySQL database and application properties before starting the backend.

### Frontend

```bash
cd DairyXpress-Frontend
npm install
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## 🔐 Authentication Flow

```text
User Login
    ↓
Spring Security
    ↓
JWT Token
    ↓
Frontend
    ↓
Protected REST APIs
    ↓
Spring Boot Backend
```

---

## 📸 Screenshots

Add screenshots of your application here:

```text
Frontend Home Page
Product Page
Cart
Checkout
Admin Dashboard
Order Tracking
```

> Tip: Screenshots make the repository much easier for recruiters to understand quickly.

---

## 💡 What I Worked On

* Developed the React.js frontend and reusable UI components.
* Built REST APIs using Spring Boot.
* Implemented authentication and authorization using Spring Security and JWT.
* Integrated MySQL using Hibernate/JPA.
* Implemented shopping cart, wishlist, coupons and checkout workflows.
* Developed order and inventory management functionality.
* Integrated Leaflet and OpenStreetMap for delivery tracking.
* Implemented multilingual support for English and Hindi.
* Used Git and GitHub for source-code management.

---

## 👨‍💻 Developer

### Vipul Lokhande

**Computer Engineering | Full-Stack Developer**

**Skills:**
Java • Spring Boot • React.js • TypeScript • MySQL • Hibernate • REST API • Spring Security • JWT • Git

### GitHub

**VipulLokhande12**

---

## ⭐ Project Highlights

```text
React.js + Spring Boot
        ↓
REST API Architecture
        ↓
JWT Authentication
        ↓
Hibernate / JPA
        ↓
MySQL Database
```

A complete full-stack project demonstrating frontend development, backend API development, database integration, authentication, e-commerce workflows, and third-party map integration.

---

## 📄 License

This project is developed for educational and portfolio purposes.
