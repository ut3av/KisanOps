# KisanOps API Specification

This document details the RESTful / Edge Function API endpoints designed for KisanOps services.

---

## 1. Machinery & Recommendations

### `GET /api/v1/machines`
List machines matching search and filter criteria.

**Query Parameters:**
- `category` (optional): `HARVESTER`, `TRACTOR`, `ROTAVATOR`, etc.
- `status` (optional): `AVAILABLE`, `ACTIVE`, `RESERVED`
- `max_distance_km` (optional): `35`
- `min_health_score` (optional): `85`

---

### `POST /api/v1/recommendations/match`
Evaluate explainable machine fit score for a specific farmer and activity.

**Request Body:**
```json
{
  "farm_id": "farm-ramesh-01",
  "activity": "HARVESTING",
  "required_date": "2026-08-22"
}
```

**Response:**
```json
{
  "matches": [
    {
      "machine_id": "mach-jd-harv-07",
      "match_score": 94,
      "reasons": [
        "Optimally configured for harvesting",
        "Excellent match for Wheat crop",
        "Immediately available",
        "3.2 km from farm",
        "Excellent health rating (94%)"
      ],
      "quoted_rate_per_hour": 980
    }
  ]
}
```

---

## 2. Dynamic Pricing

### `POST /api/v1/pricing/quote`
Generate itemized dynamic price quote with surge bounds.

**Request Body:**
```json
{
  "machine_id": "mach-jd-harv-07",
  "farm_id": "farm-ramesh-01",
  "is_urgent": false
}
```

**Response:**
```json
{
  "base_rate_per_hour": 980,
  "quoted_rate_per_hour": 980,
  "surge_multiplier": 1.00,
  "explanation": [
    { "title": "Base Rental Rate", "amount": 980, "type": "neutral" },
    { "title": "High Peak Season Demand", "amount": 118, "type": "positive" },
    { "title": "Certified Prime Fleet Discount", "amount": -20, "type": "negative" }
  ]
}
```

---

## 3. AgriCredit System

### `POST /api/v1/credit/evaluate`
Calculate farmer deferred credit limit and rating tier.

**Request Body:**
```json
{
  "farmer_id": "user-farmer-ramesh"
}
```

**Response:**
```json
{
  "credit_score": 742,
  "rating_category": "Good",
  "credit_limit": 8000,
  "available_credit": 8000,
  "status": "ELIGIBLE_FOR_DEFERRED_PAYMENT"
}
```

---

## 4. Bookings & Lifecycle

### `POST /api/v1/bookings`
Create new machinery booking.

**Request Body:**
```json
{
  "machine_id": "mach-jd-harv-07",
  "farm_id": "farm-ramesh-01",
  "activity": "HARVESTING",
  "booked_hours": 6.0,
  "start_time": "2026-08-22T08:00:00Z",
  "payment_method": "AGRICREDIT_DEFERRED"
}
```

---

## 5. Telematics Stream & Anomaly Webhook

### `GET /api/v1/telematics/:machine_id/stream`
Stream CAN-Bus sensor telemetry (Server-Sent Events / WebSocket).

**Payload:**
```json
{
  "machine_id": "mach-jd-harv-07",
  "timestamp": "2026-08-21T10:15:30Z",
  "latitude": 23.1870,
  "longitude": 77.1005,
  "speed_kmh": 14.8,
  "fuel_level_percent": 67.8,
  "fuel_consumption_rate_lph": 8.4,
  "engine_temperature_c": 92.4,
  "rpm": 1980,
  "engine_hours": 1243.8,
  "status": "ACTIVE"
}
```

---

## 6. Invoices & Settlement

### `GET /api/v1/invoices/:booking_id`
Retrieve finalized post-rental tax invoice.
