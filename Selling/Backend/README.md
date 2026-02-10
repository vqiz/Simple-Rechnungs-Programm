# Rechnix Backend

Java Spring Boot backend for Rechnix licensing and update system.

## Setup

1.  **Prerequisites**: Java 17+ (Java 25 is also supported).
2.  **Location**: `Selling/Backend`

## Configuration

Edit `src/main/resources/application.properties` to set your Stripe API Key.
```properties
stripe.api.key=sk_test_...
```

## Running the Application

If you have Gradle installed:
```bash
gradle bootRun
```

Or generate the wrapper once (requires gradle installed globally) and then use:
```bash
./gradlew bootRun
```

## Endpoints (Base: http://127.0.0.1:3002/rechnix_api)

### Authentication
- `POST /auth/register`: `{ "email": "...", "password": "..." }`
- `POST /auth/login`: `{ "email": "...", "password": "..." }`

### Payment (Stripe)
- `POST /payment/checkout/license`: `{ "priceId": "price_..." }` (Requires Auth)
- `POST /payment/checkout/update`: `{ "updateId": 1, "priceId": "price_..." }` (Requires Auth)
- `POST /payment/verify`: `{ "sessionId": "cs_..." }` (Public/Auth)

### License
- `POST /license/activate`: `{ "licenseKey": "...", "hardwareId": "..." }`

### Updates
- `GET /updates`: List all updates.
- `GET /updates/download/{version}`: Download specific version (Requires Auth + Purchase).
- `POST /updates/admin/upload`: Multipart file upload (Requires Admin).

## Default Admin
- **Email**: `admin@rechnix.com`
- **Password**: `admin`
