# API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Routes Endpoints

### Get All Routes
```http
GET /routes
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "routeNumber": "1A",
    "name": "Downtown Express",
    "description": "Express route to downtown area",
    "stops": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "startPoint": {
      "name": "Central Station",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "endPoint": {
      "name": "Airport Terminal",
      "latitude": 40.7700,
      "longitude": -73.8740
    },
    "distance": 25,
    "estimatedDuration": 45,
    "operatingHours": {
      "startTime": "06:00",
      "endTime": "23:00"
    },
    "frequency": 15,
    "status": "active",
    "color": "#EF4444",
    "busCount": 5
  }
]
```

---

### Get Route by ID
```http
GET /routes/:id
```

**Parameters:**
- `id` (string) - Route ID

**Response:** Single route object

---

### Create Route
```http
POST /routes
```

**Request Body:**
```json
{
  "routeNumber": "5E",
  "name": "Evening Commute",
  "description": "Peak hour express service",
  "startPoint": {
    "name": "Station A",
    "latitude": 40.7580,
    "longitude": -73.9855
  },
  "endPoint": {
    "name": "Station B",
    "latitude": 40.7489,
    "longitude": -74.0025
  },
  "polyline": [
    { "latitude": 40.7580, "longitude": -73.9855 },
    { "latitude": 40.7489, "longitude": -74.0025 }
  ],
  "distance": 5,
  "estimatedDuration": 15,
  "operatingHours": {
    "startTime": "16:00",
    "endTime": "20:00"
  },
  "frequency": 10,
  "busCount": 3,
  "color": "#F59E0B"
}
```

**Response:** Created route object with `_id`

---

### Update Route
```http
PUT /routes/:id
```

**Parameters:**
- `id` (string) - Route ID

**Request Body:** Any fields to update (partial update)

**Response:** Updated route object

---

### Delete Route
```http
DELETE /routes/:id
```

**Parameters:**
- `id` (string) - Route ID

**Response:**
```json
{
  "message": "Route deleted successfully",
  "route": { /* deleted route object */ }
}
```

---

### Search Routes
```http
GET /routes/search?query=1A
```

**Query Parameters:**
- `query` (string) - Search by route number or name

**Response:** Array of matching routes

---

## Stops Endpoints

### Get All Stops
```http
GET /stops
```

**Response:** Array of all stops

---

### Get Stop by ID
```http
GET /stops/:id
```

**Parameters:**
- `id` (string) - Stop ID

**Response:** Single stop object

---

### Create Stop
```http
POST /stops
```

**Request Body:**
```json
{
  "name": "New Bus Station",
  "code": "NBS",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "address": "123 Main Street",
  "amenities": ["shelter", "bench", "lighting"],
  "zone": "A",
  "accessibility": {
    "wheelchair_accessible": true,
    "visual_aid": true,
    "elevator": false
  }
}
```

**Response:** Created stop object with `_id`

---

### Update Stop
```http
PUT /stops/:id
```

**Parameters:**
- `id` (string) - Stop ID

**Request Body:** Any fields to update

**Response:** Updated stop object

---

### Delete Stop
```http
DELETE /stops/:id
```

**Parameters:**
- `id` (string) - Stop ID

**Response:**
```json
{
  "message": "Stop deleted successfully",
  "stop": { /* deleted stop object */ }
}
```

---

### Get Nearby Stops
```http
GET /stops/nearby?latitude=40.7128&longitude=-74.0060&radius=1
```

**Query Parameters:**
- `latitude` (number) - User's latitude (**Required**)
- `longitude` (number) - User's longitude (**Required**)
- `radius` (number) - Search radius in kilometers (default: 1)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Central Station",
    "code": "CS",
    "location": { "latitude": 40.7128, "longitude": -74.0060 },
    "distance": 0.15,
    "routes": [/* route objects */]
  }
]
```

**Note:** Results are sorted by distance (closest first)

---

### Search Stops
```http
GET /stops/search?query=central
```

**Query Parameters:**
- `query` (string) - Search by stop code or name

**Response:** Array of matching stops

---

## Buses Endpoints

### Get All Buses
```http
GET /buses
```

**Response:** Array of all buses

---

### Get Bus by ID
```http
GET /buses/:id
```

**Parameters:**
- `id` (string) - Bus ID

**Response:** Single bus object with populated route and stop info

---

### Get Buses on Route
```http
GET /buses/route/:routeId
```

**Parameters:**
- `routeId` (string) - Route ID

**Response:** Array of buses on that route

---

### Create Bus
```http
POST /buses
```

**Request Body:**
```json
{
  "busNumber": "1A-5",
  "route": "507f1f77bcf86cd799439011",
  "currentLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "status": "running",
  "capacity": 60,
  "driverId": "driver_123",
  "driverName": "John Doe"
}
```

**Response:** Created bus object

---

### Update Bus Location (Real-Time)
```http
PUT /buses/:id/location
```

**Parameters:**
- `id` (string) - Bus ID

**Request Body:**
```json
{
  "latitude": 40.7200,
  "longitude": -74.0000,
  "speed": 35.5,
  "heading": 45,
  "nextStop": {
    "stop": "507f1f77bcf86cd799439012",
    "eta": "2024-01-15T14:30:00Z",
    "distance": 2.5
  },
  "delayMinutes": 5,
  "status": "running",
  "occupancy": 42
}
```

**Response:** Updated bus object

**Socket.io Event:** `bus_location_updated` is emitted to all connected clients

---

### Update Bus Status
```http
PUT /buses/:id/status
```

**Parameters:**
- `id` (string) - Bus ID

**Request Body:**
```json
{
  "status": "delayed",
  "lastStopServed": "507f1f77bcf86cd799439012"
}
```

**Response:** Updated bus object

---

### Delete Bus
```http
DELETE /buses/:id
```

**Parameters:**
- `id` (string) - Bus ID

**Response:**
```json
{
  "message": "Bus deleted successfully",
  "bus": { /* deleted bus object */ }
}
```

---

## Real-Time Events (Socket.io)

### Subscribe to Route Updates
```javascript
socket.emit('subscribe_route', routeId);
```

**Response:**
```javascript
socket.on('bus_location_updated', (bus) => {
  // Bus location, speed, status updated
  console.log(bus.busNumber, bus.currentLocation);
});
```

---

### Unsubscribe from Route
```javascript
socket.emit('unsubscribe_route', routeId);
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Query parameter is required",
  "details": ["Latitude and longitude are required"]
}
```

### 404 Not Found
```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "stack": "Error trace (development only)"
}
```

---

## Usage Examples

### Using Axios (Frontend)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Get all routes
const routes = await api.get('/routes');

// Create a stop
const newStop = await api.post('/stops', {
  name: 'New Stop',
  code: 'NS',
  location: { latitude: 40.7, longitude: -74.0 }
});

// Update bus location
await api.put(`/buses/${busId}/location`, {
  latitude: 40.72,
  longitude: -74.00,
  speed: 35
});
```

### Using cURL (Terminal)
```bash
# Get all routes
curl http://localhost:5000/api/routes

# Create a new stop
curl -X POST http://localhost:5000/api/stops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Stop",
    "code": "TS",
    "location": {"latitude": 40.7, "longitude": -74.0}
  }'

# Get nearby stops
curl "http://localhost:5000/api/stops/nearby?latitude=40.7128&longitude=-74.0060&radius=1"
```

### Using Socket.io (Real-Time)
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Subscribe to route updates
socket.emit('subscribe_route', '507f1f77bcf86cd799439011');

// Receive real-time updates
socket.on('bus_location_updated', (bus) => {
  console.log(`Bus ${bus.busNumber} is at`, bus.currentLocation);
});

// Unsubscribe when done
socket.emit('unsubscribe_route', '507f1f77bcf86cd799439011');
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently no rate limiting implemented. For production, consider:
- Express-rate-limit package
- Redis for distributed rate limiting
- API key system

---

## Authentication (Future)

Currently no authentication. Future implementation:
- JWT tokens
- Express middleware for protected routes
- User roles (admin, user)

---

## API Response Format

All responses follow consistent format:

**Success (Array):**
```json
[
  { /* resource 1 */ },
  { /* resource 2 */ }
]
```

**Success (Single):**
```json
{
  "_id": "...",
  "field": "value"
}
```

**Error:**
```json
{
  "error": "Error message",
  "details": ["Additional info"]
}
```

---

**Last Updated:** Jan 2024
