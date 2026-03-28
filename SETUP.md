# SETUP & RUN INSTRUCTIONS

## Complete Setup Guide for Public Transport Dashboard

### ✅ System Requirements
- Node.js v16 or higher
- npm v7 or higher
- MongoDB v4.4 or higher (Local or MongoDB Atlas)
- Windows/Mac/Linux

---

## 🔧 STEP 1: Install MongoDB

### Option A: Local MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. Start MongoDB Service in Services app
4. Or run: `mongod --dbpath "C:\path\to\data"`

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
curl https://packages.mongodb.org/apt/ubuntu/dists/focal/mongodb-org/6.0/Release | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://packages.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update && apt install -y mongodb-org
systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/transport-dashboard`
4. Use this in `.env` file

---

## 🚀 STEP 2: Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
# File already created as .env
# Verify MONGODB_URI is correct:
cat .env
```

If using MongoDB Atlas, update the `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transport-dashboard
```

### 4. Seed database with dummy data
```bash
npm run seed
```

Output should show:
```
✓ Connected to MongoDB
✓ Cleared existing data
✓ Created 10 stops
✓ Created 4 routes
✓ Created 14 buses
✓ Database seed completed successfully!
```

### 5. Start backend server
```bash
npm run dev
```

✓ **Backend running on** http://localhost:5000

Check health: http://localhost:5000/health

---

## 🎨 STEP 3: Frontend Setup

### 1. Open new terminal and navigate to frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start frontend development server
```bash
npm run dev
```

✓ **Frontend running on** http://localhost:5173

---

## ✅ STEP 4: Verify Installation

### Test Backend APIs

1. **Get all routes:**
```bash
curl http://localhost:5000/api/routes
```

2. **Get all stops:**
```bash
curl http://localhost:5000/api/stops
```

3. **Get all buses:**
```bash
curl http://localhost:5000/api/buses
```

### Test Frontend

Open browser to http://localhost:5173

You should see:
- 🗺️ Interactive map with bus markers
- 🛣️ Route list in sidebar
- 🛑 Bus stops marked on map
- 🚌 Real-time bus tracking
- 📍 Nearby stops feature

---

## 📝 Common Issues & Solutions

### Issue 1: MongoDB Connection Error
```
✗ MongoDB connection error: connect ECONNREFUSED
```

**Solution:**
- Windows: Start MongoDB Service in Services app
- Mac: `brew services start mongodb-community`
- Linux: `systemctl start mongod`
- Or check MongoDB is running: `mongosh`

### Issue 2: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution (Windows PowerShell):**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Solution (Mac/Linux):**
```bash
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Issue 3: npm Dependencies Not Installing
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: CORS Errors in Console
Make sure frontend URL is correct in backend `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Issue 5: Map Not Loading
- Check browser DevTools Console (F12)
- Verify Leaflet CSS is loaded
- Check internet connection (map tiles download from web)

---

## 🔄 Running Both Simultaneously

### Method 1: Two Terminal Windows (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Using npm-run-all (Single Terminal)

Global install:
```bash
npm install -g npm-run-all
```

From project root:
```bash
# Add to root package.json scripts
npm-run-all --parallel dev:backend dev:frontend
```

### Method 3: VS Code Tasks

Press `Ctrl+Shift+B` in VS Code to run configured tasks.

---

## 📊 Testing Features

### 1. Real-Time Bus Tracking
- Select a route from sidebar
- Watch buses move on map in real-time
- Console logs show updates every 5 seconds

### 2. Search Functionality
- Use search bar to find routes by:
  - Route number (e.g., "1A")
  - Route name (e.g., "Express")
  - Stop code (e.g., "CS")
  - Stop name (e.g., "Central")

### 3. Nearby Stops
- Click "📍 Nearby" tab in sidebar
- Allow location access when prompted
- See stops within 1 km sorted by distance

### 4. Dark Mode
- Click moon icon in top-right header
- Toggle between light and dark themes
- Preference saved in localStorage

### 5. Real-Time Delays
- Buses randomly get delays (20% chance every update)
- Check "Delayed" status in bus list
- Notification center shows alerts

---

## 🛠️ Project Structure Overview

```
📁 transport-dashboard/
├── 📁 backend/
│   ├── 📁 models/              # MongoDB schemas
│   ├── 📁 controllers/         # Business logic
│   ├── 📁 routes/              # API endpoints
│   ├── 📁 utils/
│   │   ├── busSimulation.js    # Real-time bus movement
│   │   └── socket.js           # Socket.io setup
│   ├── 📁 data/
│   │   └── seedData.js         # Dummy data generator
│   ├── 📁 config/
│   │   └── database.js         # MongoDB connection
│   ├── 📁 middleware/
│   │   └── errorHandler.js     # Error handling
│   ├── server.js               # Express app
│   ├── package.json
│   ├── .env                    # Configuration
│   └── .gitignore
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 hooks/           # Custom hooks
│   │   ├── 📁 context/         # Zustand store
│   │   ├── 📁 utils/           # API client
│   │   ├── 📁 styles/          # CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.local
│
├── README.md                   # Full documentation
├── SETUP.md                    # This file
└── package.json
```

---

## 🎓 Learning Key Patterns

### Real-Time Updates (Socket.io)
File: `backend/utils/busSimulation.js`
- Simulates bus movement every 5 seconds
- Emits updates to connected clients
- Frontend receives in `useRealTimeBuses` hook

### State Management (Zustand)
File: `frontend/src/context/store.js`
- Global state for routes, buses, stops
- Dark mode toggle
- Notifications

### Custom Hooks
File: `frontend/src/hooks/useData.js`
- `useRoutes()` - Fetch all routes
- `useBuses()` - Fetch all buses
- `useNearbyStops()` - Find stops nearby
- `useSearchRoutes()` - Search with debounce

### Map Integration (Leaflet)
File: `frontend/src/components/Map.jsx`
- Dynamic markers for buses and stops
- Polylines for routes
- Real-time marker updates

---

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

Output in `frontend/dist/`

---

## 🚀 Deployment Options

**Backend Deployment:**
- Heroku, Railway, Render, AWS EC2
- Keep MongoDB connection URI secure in environment

**Frontend Deployment:**
- Vercel, Netlify, GitHub Pages
- Build and serve dist/ folder

---

## ✨ Next Steps

1. ✅ Both servers running?
2. ✅ Can see map with buses?
3. ✅ Real-time updates working?
4. Now try:
   - Add new routes via API
   - Create custom bus simulation
   - Build admin panel
   - Deploy to production!

---

**Happy Transit Dashboard Development! 🚌**
