import mongoose from 'mongoose';

// Route Schema - Defines structure of bus routes
const routeSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: [true, 'Route number is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true
    },
    description: String,
    stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop'
      }
    ],
    // Start and end coordinates for route display
    startPoint: {
      name: String,
      latitude: Number,
      longitude: Number
    },
    endPoint: {
      name: String,
      latitude: Number,
      longitude: Number
    },
    // Route polyline coordinates for map display
    polyline: [
      {
        latitude: Number,
        longitude: Number
      }
    ],
    distance: Number, // in km
    estimatedDuration: Number, // in minutes
    operatingHours: {
      startTime: String, // HH:MM format
      endTime: String    // HH:MM format
    },
    frequency: Number, // minutes between buses
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    color: {
      type: String,
      default: '#3B82F6' // Tailwind blue-500
    },
    busCount: {
      type: Number,
      default: 3
    }
  },
  { timestamps: true }
);

// Populate stops when fetching
routeSchema.pre('find', function() {
  this.populate('stops');
});

routeSchema.pre('findById', function() {
  this.populate('stops');
});

const Route = mongoose.model('Route', routeSchema);

export default Route;
