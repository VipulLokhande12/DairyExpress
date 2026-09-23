# DairyXpress Backend — Spring Boot + MySQL + JWT

## Tech Stack
- **Spring Boot 3.3** (Java 17)
- **Spring Data JPA** + **Hibernate**
- **MySQL 8** database
- **Spring Security** + **JWT** authentication
- **BCrypt** password hashing
- **Lombok** for boilerplate reduction
- **Jackson** for JSON serialization
- **Validation** (Jakarta Bean Validation)

## Project Structure
```
backend/
├── pom.xml
├── src/main/
│   ├── java/com/dairyxpress/
│   │   ├── DairyXpressApplication.java      — Main entry point
│   │   ├── config/
│   │   │   ├── SecurityConfig.java           — Security filter chain, password encoder
│   │   │   └── CorsConfig.java                — CORS configuration
│   │   ├── security/
│   │   │   ├── JwtService.java               — JWT token generation/validation
│   │   │   ├── JwtAuthFilter.java            — JWT request filter
│   │   │   └── CustomUserDetailsService.java  — User loading for auth
│   │   ├── entity/                            — JPA entities (9 tables)
│   │   ├── repository/                        — Spring Data JPA repositories
│   │   ├── dto/                               — Request/Response DTOs
│   │   ├── service/                           — Business logic layer
│   │   ├── controller/                        — REST controllers
│   │   └── exception/                         — Global exception handling
│   └── resources/
│       ├── application.properties
│       ├── data.sql                           — Seed data (8 products, 6 categories)
│       └── testimonials.json
└── src/test/
```

## Prerequisites
1. **Java 17** or later
2. **MySQL 8** running on localhost:3306
3. **Maven 3.9+** (or use `./mvnw` wrapper)

## Setup

### 1. Configure MySQL
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dairy_xpress?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```
The database `dairy_xpress` is created automatically on first run.

### 2. Build & Run
```bash
cd backend
mvn clean package
java -jar target/dairy-xpress-backend-1.0.0.jar
```
Or run in development:
```bash
mvn spring-boot:run
```
The API starts on **http://localhost:8080**

### 3. Seed Data
On first startup, `data.sql` seeds:
- 1 admin user (admin@dairyxpress.farm / password123)
- 1 demo customer (guest@dairyxpress.farm / password123)
- 6 categories (milk, paneer, cheese, butter, ghee, yogurt)
- 8 products with full details (nutrition, ingredients, gallery)

## API Endpoints

### Public (no auth)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new customer |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/products` | All products (optional `?category=` `&search=`) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/{slug}` | Single product by slug |
| GET | `/api/categories` | All categories |
| GET | `/api/testimonials` | Customer testimonials |
| GET | `/api/products/{productId}/reviews` | Reviews for a product |

### Authenticated (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | User's order history |
| GET | `/api/wishlist` | User's wishlist |
| POST | `/api/wishlist` | Toggle wishlist item |
| DELETE | `/api/wishlist/{productId}` | Remove from wishlist |
| GET | `/api/addresses` | User's addresses |
| POST | `/api/addresses` | Add address |
| DELETE | `/api/addresses/{id}` | Delete address |
| GET | `/api/subscriptions` | User's subscriptions |
| POST | `/api/subscriptions` | Create subscription |
| DELETE | `/api/subscriptions/{id}` | Cancel subscription |
| POST | `/api/reviews` | Post a product review |

### Admin only (ROLE_ADMIN)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/orders` | Recent orders |
| GET | `/api/admin/products/low-stock` | Low stock products |
| PUT | `/api/admin/products/{id}/stock` | Update product stock |

## Authentication
All authenticated endpoints require a JWT Bearer token:
```
Authorization: Bearer <token>
```
Tokens expire after 24 hours (configurable in `application.properties`).

## Frontend Integration
The frontend is pre-configured to call `http://localhost:8080/api`. To change:
```env
# In frontend .env
VITE_API_URL=http://your-backend:8080/api
```
