# DairyXpress — Full-Stack Project

A premium farm-to-home dairy delivery app with a React + TypeScript frontend and Spring Boot + MySQL backend.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Router (routing)
- Axios (HTTP client)
- Lucide React (icons)

**Backend**
- Spring Boot 3.3
- Spring Data JPA
- Spring Security + JWT authentication
- MySQL 8
- Lombok
- Maven

## Prerequisites

1. **Java 17+** — `java -version`
2. **Maven 3.8+** — `mvn -version`
3. **MySQL 8+** — running on `localhost:3306`
   - Username: `root`
   - Password: `root`
   - The database `dairy_xpress` is created automatically on first run.
4. **Node.js 18+** — `node -v`

## Setup & Run

### 1. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080/api**.

On first run, Spring Boot will:
- Create the `dairy_xpress` database automatically
- Create all tables via Hibernate (`ddl-auto=update`)
- Seed demo data (admin user, customer, categories, 8 products) via `data.sql`

### 2. Start the frontend

```bash
npm install
npm run dev
```

The app starts on **http://localhost:5173**.

### 3. Login

The app requires authentication — you'll see the login page first.

**Demo accounts** (password for both: `password123`):

| Role     | Email                      |
|----------|----------------------------|
| Admin    | admin@dairyxpress.farm    |
| Customer| guest@dairyxpress.farm    |

Or register a new account from the login page.

## API Endpoints

### Auth
| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| POST   | `/api/auth/register`  | Register a new user         |
| POST   | `/api/auth/login`     | Login, returns JWT + user   |
| GET    | `/api/auth/me`        | Get current user from token |

### Products
| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/api/products`             | List all (filter by category/search) |
| GET    | `/api/products/{slug}`      | Get single product           |
| GET    | `/api/products/featured`    | Featured products            |
| GET    | `/api/categories`           | All categories               |

### Orders
| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| POST   | `/api/orders`   | Create order          |
| GET    | `/api/orders`   | List user's orders    |

### Wishlist
| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| GET    | `/api/wishlist`           | Get wishlist            |
| POST   | `/api/wishlist`           | Add to wishlist         |
| DELETE | `/api/wishlist/{productId}`| Remove from wishlist   |

### Addresses
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/addresses`      | List addresses      |
| POST   | `/api/addresses`      | Add address         |
| DELETE | `/api/addresses/{id}`  | Delete address      |

### Subscriptions
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/subscriptions`      | List subscriptions       |
| POST   | `/api/subscriptions`      | Create subscription      |
| DELETE | `/api/subscriptions/{id}` | Cancel subscription      |

### Admin
| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | `/api/admin/stats`               | Dashboard stats          |
| GET    | `/api/admin/orders`               | Recent orders            |
| GET    | `/api/admin/products/low-stock`   | Low stock products       |
| PUT    | `/api/admin/products/{id}/stock`  | Update product stock     |

### Testimonials
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/testimonials`   | List testimonials   |

## Features

- **Authentication**: JWT-based login/registration with protected routes
- **Product catalog**: Browse by category, search, sort, filter
- **Product details**: Gallery, nutrition facts, ingredients, reviews
- **Cart**: Add/remove items, quantity control, coupon codes, free delivery threshold
- **Checkout**: Multi-step flow (address → payment → review → confirmation)
- **Profile dashboard**: Orders, wishlist, saved addresses, subscriptions
- **Subscriptions**: Daily/weekly/monthly milk plans with cancel anytime
- **Admin dashboard**: Revenue KPIs, recent orders, low-stock alerts, inventory
- **Responsive design**: Works on mobile, tablet, and desktop

## Project Structure

```
dairy-xpress/
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/com/dairyxpress/
│   │   ├── controller/         # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # JPA repositories
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── security/            # JWT + Spring Security
│   │   ├── config/              # CORS + Security config
│   │   └── exception/          # Global exception handler
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql             # Seed data
├── src/                         # React frontend
│   ├── components/              # UI components
│   ├── pages/                   # Page components
│   ├── services/                # API client
│   ├── store/                   # Context providers
│   └── data/                    # Static assets & types
└── package.json
```

## Configuration

To change the MySQL credentials, edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

To change the frontend API URL, set `VITE_API_URL` in `.env`:

```
VITE_API_URL=http://localhost:8080/api
```
