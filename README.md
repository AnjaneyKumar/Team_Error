# Public Transport Information Dashboard

A modern, production-ready web application for real-time public bus tracking, route planning, and transit information.

## 🎯 Features

✅ **Real-time Bus Tracking** - Live bus locations with Socket.io  
✅ **Route Management** - View and search bus routes  
✅ **Stop Information** - Detailed stop details and amenities  
✅ **ETA Calculation** - Estimated arrival times  
✅ **Nearby Stops** - Find closest stops using geolocation  
✅ **Dark Mode** - Beautiful dark/light theme toggle  
✅ **Responsive Design** - Mobile-first UI with Tailwind CSS  
✅ **Map Integration** - Interactive Leaflet map  
✅ **Notifications** - Delay and status alerts  
✅ **Admin Panel Ready** - Create/edit/delete routes and buses  

---

## 📁 Project Structure

```
transport-dashboard/
├── backend/                 # Express.js + MongoDB Backend
│   ├── models/             # Database schemas (Route, Stop, Bus)
│   ├── controllers/        # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Error handling
│   ├── utils/             # Helper functions & bus simulation
│   ├── data/              # Seed data
│   ├── config/            # MongoDB connection
│   ├── server.js          # Main entry point
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment variables

├── frontend/              # React + Vite Frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # Zustand state management
│   │   ├── utils/        # API client & socket.io
│   │   ├── styles/       # CSS & Tailwind
│   │   ├── App.jsx       # Root component
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static files
│   ├── package.json      # Dependencies
│   ├── vite.config.js    # Vite configuration
│   └── tailwind.config.js    # Tailwind configuration

└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
copy .env.example .env
```

4. Update `.env` with your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/transport-dashboard
```

5. Seed the database with dummy data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

✓ Backend running on `http://localhost:5000`

---

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional):
```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

✓ Frontend running on `http://localhost:5173`

---

## 📡 API Endpoints

### Routes
```
GET    /api/routes              # Get all routes
GET    /api/routes/:id          # Get route by ID
GET    /api/routes/search       # Search routes
POST   /api/routes              # Create new route
PUT    /api/routes/:id          # Update route
DELETE /api/routes/:id          # Delete route
```

### Stops
```
GET    /api/stops               # Get all stops
GET    /api/stops/:id           # Get stop by ID
GET    /api/stops/search        # Search stops
GET    /api/stops/nearby        # Get nearby stops
POST   /api/stops               # Create new stop
PUT    /api/stops/:id           # Update stop
DELETE /api/stops/:id           # Delete stop
```

### Buses
```
GET    /api/buses               # Get all buses
GET    /api/buses/:id           # Get bus by ID
GET    /api/buses/route/:routeId  # Get buses on route
POST   /api/buses               # Create new bus
PUT    /api/buses/:id/location  # Update bus location (real-time)
PUT    /api/buses/:id/status    # Update bus status
DELETE /api/buses/:id           # Delete bus
```

---

## 🎨 Technology Stack

### Backend
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time bidirectional communication
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (lightning-fast)
- **Tailwind CSS** - Utility-first CSS
- **Leaflet** - Interactive maps
- **Socket.io Client** - Real-time updates
- **Zustand** - State management
- **Axios** - HTTP client

---

## 🔄 Real-Time Features

### Bus Simulation
The backend includes a built-in bus simulator that:
- Updates bus locations every 5 seconds
- Simulates realistic speed variations
- Generates random delays (20% chance)
- Updates occupancy levels
- Broadcasts updates via Socket.io

### Socket.io Events

**Server emits:**
```javascript
socket.on('bus_location_updated', (bus) => {
  // Bus location, speed, status updated
});
```

**Client emits:**
```javascript
socket.emit('subscribe_route', routeId);    // Subscribe to route updates
socket.emit('unsubscribe_route', routeId);  // Unsubscribe
```

---

## 📋 Sample Data

The database is seeded with:
- **4 routes** with varying stops and schedules
- **10 bus stops** with accessibility info and amenities
- **14 buses** distributed across routes
- Realistic coordinates in New York City area

Run `npm run seed` in backend folder to populate data.

---

## 🎮 Usage Examples

### View All Routes
```javascript
// Frontend
const response = await axios.get('/api/routes');
const routes = response.data;
```

### Track Bus in Real-Time
```javascript
// Frontend
const socket = io('http://localhost:5000');
socket.emit('subscribe_route', routeId);
socket.on('bus_location_updated', (bus) => {
  console.log(`Bus ${bus.busNumber} at:`, bus.currentLocation);
});
```

### Get Nearby Stops
```javascript
// Frontend
const response = await axios.get('/api/stops/nearby', {
  params: {
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 1  // 1 km
  }
});
```

### Calculate ETA
```javascript
// Backend
const distance = calculateDistance(lat1, lng1, lat2, lng2);
const { timeInMinutes, eta } = calculateETA(distance, speed);
```

---

## 🛠️ Development

### Running Both Simultaneously (With npm-run-all)

```bash
# Install globally
npm install -g npm-run-all

# Run from root directory
npm-run-all --parallel dev:backend dev:frontend

# Add this to root package.json:
{
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev": "npm-run-all --parallel dev:backend dev:frontend"
  }
}
```

### Building for Production

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/transport-dashboard
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📊 Data Models

### Route
```javascript
{
  routeNumber: String,
  name: String,
  description: String,
  stops: [Object ID],
  startPoint: { name, latitude, longitude },
  endPoint: { name, latitude, longitude },
  polyline: [{ latitude, longitude }],
  distance: Number,
  estimatedDuration: Number,
  operatingHours: { startTime, endTime },
  frequency: Number,
  status: String,
  color: String,
  busCount: Number
}
```

### Stop
```javascript
{
  name: String,
  code: String,
  location: { latitude, longitude },
  address: String,
  amenities: [String],
  zone: String,
  routes: [Object ID],
  accessibility: {
    wheelchair_accessible: Boolean,
    visual_aid: Boolean,
    elevator: Boolean
  }
}
```

### Bus
```javascript
{
  busNumber: String,
  route: Object ID,
  currentLocation: { latitude, longitude, updatedAt },
  nextStop: { stop, eta, distance },
  status: String,
  speed: Number,
  heading: Number,
  capacity: Number,
  occupancy: Number,
  delayMinutes: Number,
  lastStopServed: Object ID
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection URI in `.env`
- Create database manually if needed

### Port Already in Use
```bash
# Kill process on port 5000 (Linux/Mac)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check Socket.io CORS origin

### Map Not Loading
- Check browser console for Leaflet errors
- Verify Leaflet CSS is loaded
- Check map container has proper height

---

## 🚀 Deployment

### Deploy Backend (Heroku example)
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Deploy Frontend (Vercel example)
```bash
npm install -g vercel
cd frontend
vercel
```

---

## 📝 Key Code Comments

Throughout the codebase, look for comments explaining:
- **Real-time synchronization** - How buses update locations
- **Distance calculations** - Haversine formula for geolocation
- **State management** - Zustand store patterns
- **API integration** - Axios interceptors example
- **Error handling** - Middleware approach

---

## 📱 Features for Future

- PWA support (installable app)
- Offline caching with Service Workers
- Multi-language support (i18n)
- User authentication
- Route favoriting
- Notification preferences
- Analytics dashboard
- Mobile app (React Native)

---

## 📄 License

MIT - Feel free to use this for your projects!

---

## 💬 Support

For issues or questions, check:
1. Browser console for errors
2. Backend logs in terminal
3. MongoDB connection status
4. Network tab in DevTools

---

**Made with ❤️ by the Transit Team**
