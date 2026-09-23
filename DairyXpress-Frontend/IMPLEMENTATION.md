# DairyXpress tracking, location, and AI assistant

## What was added

- Checkout can request the customer's browser location, reverse-geocode it with OpenStreetMap Nominatim, and lets the customer confirm/edit the address.
- Order records persist the delivery latitude and longitude.
- Profile > Orders has an expandable tracking view with order stages and an OpenStreetMap destination map.
- A floating "Ask Moo" assistant is available throughout the signed-in app.
- The assistant calls the backend only; the OpenAI API key is never exposed to the browser. If no key is configured, useful local support answers remain available.
- Admin product management can create products and edit stock, selling price, and original price/discount.
- Inventory at 1–9 units is marked low stock; 0 units is marked out of stock. Customers cannot add out-of-stock products to the cart.
- Wishlist links accept both product slugs and numeric product IDs, fixing the Product not found screen for saved items.
- Subscriptions can be paused and resumed without deleting the subscription.

## Configuration

Set these environment variables before starting Spring Boot:

```text
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.6-luna
```

`OPENAI_MODEL` is optional. Browser geolocation requires `https://` in production (localhost is allowed during development). The map and reverse-geocoding features require internet access to OpenStreetMap services.

## Tracking statuses

The UI recognizes `PREPARING`, `PACKED`, `OUT_FOR_DELIVERY`, and `DELIVERED`. Update an order's `status` through your admin/dispatch workflow as fulfilment progresses. The map shows the customer's saved delivery destination; true moving-driver GPS requires a delivery-partner app to publish driver coordinates periodically.

## Verification

Frontend TypeScript type-checking passes. Vite's production bundling could not launch its `esbuild` child process in the restricted Codex sandbox (`spawn EPERM`), so run `npm run build` once in a normal local shell. Maven was not installed in the Codex environment; run `mvn test` in the backend directory locally.
