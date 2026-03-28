import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Route from '../models/Route.js';
import Stop from '../models/Stop.js';
import Bus from '../models/Bus.js';

dotenv.config();

// Sample routes data
const routesData = [
  {
    routeNumber: '1A',
    name: 'Downtown Express',
    description: 'Express route to downtown area',
    startPoint: { name: 'Central Station', latitude: 40.7128, longitude: -74.0060 },
    endPoint: { name: 'Airport Terminal', latitude: 40.7700, longitude: -73.8740 },
    polyline: [
      { latitude: 40.7128, longitude: -74.0060 },
      { latitude: 40.7200, longitude: -74.0000 },
      { latitude: 40.7300, longitude: -73.9900 },
      { latitude: 40.7500, longitude: -73.9700 },
      { latitude: 40.7700, longitude: -73.8740 }
    ],
    distance: 25,
    estimatedDuration: 45,
    operatingHours: { startTime: '06:00', endTime: '23:00' },
    frequency: 15,
    busCount: 5,
    color: '#EF4444'
  },
  {
    routeNumber: '2B',
    name: 'North City Bus',
    description: 'North district service route',
    startPoint: { name: 'Main Square', latitude: 40.6500, longitude: -74.0100 },
    endPoint: { name: 'North Park Station', latitude: 40.8200, longitude: -73.9500 },
    polyline: [
      { latitude: 40.6500, longitude: -74.0100 },
      { latitude: 40.7000, longitude: -73.9800 },
      { latitude: 40.7500, longitude: -73.9600 },
      { latitude: 40.8200, longitude: -73.9500 }
    ],
    distance: 18,
    estimatedDuration: 35,
    operatingHours: { startTime: '05:00', endTime: '22:00' },
    frequency: 10,
    busCount: 4,
    color: '#3B82F6'
  },
  {
    routeNumber: '3C',
    name: 'East Side Loop',
    description: 'Circular route on east side',
    startPoint: { name: 'Harbor View', latitude: 40.7050, longitude: -73.9700 },
    endPoint: { name: 'Harbor View', latitude: 40.7050, longitude: -73.9700 },
    polyline: [
      { latitude: 40.7050, longitude: -73.9700 },
      { latitude: 40.7150, longitude: -73.9600 },
      { latitude: 40.7150, longitude: -73.9400 },
      { latitude: 40.7050, longitude: -73.9300 },
      { latitude: 40.6950, longitude: -73.9400 },
      { latitude: 40.6950, longitude: -73.9600 },
      { latitude: 40.7050, longitude: -73.9700 }
    ],
    distance: 8,
    estimatedDuration: 20,
    operatingHours: { startTime: '07:00', endTime: '21:00' },
    frequency: 8,
    busCount: 3,
    color: '#10B981'
  },
  {
    routeNumber: '4D',
    name: 'Westbound Night Bus',
    description: '24-hour west corridor service',
    startPoint: { name: 'City Center', latitude: 40.7580, longitude: -73.9855 },
    endPoint: { name: 'West District', latitude: 40.7489, longitude: -74.0025 },
    polyline: [
      { latitude: 40.7580, longitude: -73.9855 },
      { latitude: 40.7540, longitude: -73.9910 },
      { latitude: 40.7489, longitude: -74.0025 }
    ],
    distance: 5,
    estimatedDuration: 12,
    operatingHours: { startTime: '00:00', endTime: '23:59' },
    frequency: 20,
    busCount: 3,
    color: '#F59E0B'
  }
];

// Sample stops data
const stopsData = [
  { name: 'Central Station', code: 'CS', location: { latitude: 40.7128, longitude: -74.0060 }, address: '123 Main St', zone: 'A', amenities: ['shelter', 'bench', 'lighting'], accessibility: { wheelchair_accessible: true, visual_aid: true, elevator: true } },
  { name: 'Grand Central', code: 'GC', location: { latitude: 40.7200, longitude: -74.0000 }, address: '456 Park Ave', zone: 'A', amenities: ['shelter', 'bench'], accessibility: { wheelchair_accessible: true, visual_aid: false, elevator: false } },
  { name: 'Times Square', code: 'TS', location: { latitude: 40.7300, longitude: -73.9900 }, address: '789 Broadway', zone: 'B', amenities: ['shelter', 'lighting'], accessibility: { wheelchair_accessible: true, visual_aid: true, elevator: false } },
  { name: 'Hudson River Park', code: 'HRP', location: { latitude: 40.7500, longitude: -73.9700 }, address: 'West Side Hwy', zone: 'B', amenities: ['bench'], accessibility: { wheelchair_accessible: false, visual_aid: false, elevator: false } },
  { name: 'Airport Terminal', code: 'AT', location: { latitude: 40.7700, longitude: -73.8740 }, address: 'Terminal Road', zone: 'C', amenities: ['shelter', 'bench', 'lighting'], accessibility: { wheelchair_accessible: true, visual_aid: true, elevator: true } },
  { name: 'Main Square', code: 'MS', location: { latitude: 40.6500, longitude: -74.0100 }, address: '100 Main Sq', zone: 'A', amenities: ['shelter', 'bench', 'lighting'], accessibility: { wheelchair_accessible: true, visual_aid: false, elevator: true } },
  { name: 'North Park Station', code: 'NPS', location: { latitude: 40.8200, longitude: -73.9500 }, address: 'North Ave', zone: 'D', amenities: ['shelter'], accessibility: { wheelchair_accessible: false, visual_aid: false, elevator: false } },
  { name: 'Harbor View', code: 'HV', location: { latitude: 40.7050, longitude: -73.9700 }, address: 'Harbor St', zone: 'B', amenities: ['bench', 'lighting'], accessibility: { wheelchair_accessible: true, visual_aid: true, elevator: false } },
  { name: 'City Center', code: 'CC', location: { latitude: 40.7580, longitude: -73.9855 }, address: 'Center Plaza', zone: 'B', amenities: ['shelter', 'bench'], accessibility: { wheelchair_accessible: true, visual_aid: false, elevator: true } },
  { name: 'West District', code: 'WD', location: { latitude: 40.7489, longitude: -74.0025 }, address: 'West Side', zone: 'C', amenities: ['shelter'], accessibility: { wheelchair_accessible: false, visual_aid: false, elevator: false } }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport-dashboard';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Route.deleteMany({});
    await Stop.deleteMany({});
    await Bus.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create stops
    const createdStops = await Stop.insertMany(stopsData);
    console.log(`✓ Created ${createdStops.length} stops`);

    // Create routes and link stops
    const createdRoutes = [];
    for (let routeData of routesData) {
      // Assign stops to routes based on route number
      let assignedStops = [];
      if (routeData.routeNumber === '1A') {
        assignedStops = createdStops.slice(0, 5); // First 5 stops
      } else if (routeData.routeNumber === '2B') {
        assignedStops = [createdStops[5], createdStops[6], createdStops[1], createdStops[2]]; // Specific stops
      } else if (routeData.routeNumber === '3C') {
        assignedStops = [createdStops[7]]; // Single stop for loop
      } else if (routeData.routeNumber === '4D') {
        assignedStops = [createdStops[8], createdStops[9]]; // West route stops
      }

      const route = await Route.create({
        ...routeData,
        stops: assignedStops.map(s => s._id)
      });

      createdRoutes.push(route);

      // Link stops to routes
      for (let stop of assignedStops) {
        await Stop.findByIdAndUpdate(
          stop._id,
          { $addToSet: { routes: route._id } }
        );
      }
    }
    console.log(`✓ Created ${createdRoutes.length} routes`);

    // Create buses for each route
    const busesData = [];
    for (let route of createdRoutes) {
      for (let i = 1; i <= route.busCount; i++) {
        const bus = await Bus.create({
          busNumber: `${route.routeNumber}-${i}`,
          route: route._id,
          currentLocation: {
            latitude: route.startPoint.latitude + (Math.random() * 0.05),
            longitude: route.startPoint.longitude + (Math.random() * 0.05)
          },
          status: 'running',
          capacity: 60,
          speed: Math.random() * 40 + 10,
          occupancy: Math.floor(Math.random() * 75) + 10
        });
        busesData.push(bus);
      }
    }
    console.log(`✓ Created ${busesData.length} buses`);

    console.log('\n✓ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
