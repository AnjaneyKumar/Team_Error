import mongoose from 'mongoose';

// Bus Schema - Tracks individual buses on routes
const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Bus number is required'],
      unique: true,
      trim: true
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route is required']
    },
    // Current location of the bus
    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: {
        type: Date,
        default: Date.now
      }
    },
    // Next stop information
    nextStop: {
      stop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stop'
      },
      eta: Date, // Estimated Time of Arrival
      distance: Number // Distance to next stop in km
    },
    status: {
      type: String,
      enum: ['running', 'stopped', 'delayed', 'offline'],
      default: 'running'
    },
    // GPS data
    speed: {
      type: Number,
      default: 0 // in km/h
    },
    heading: Number, // direction in degrees
    // Occupancy information
    capacity: {
      type: Number,
      default: 60
    },
    occupancy: {
      type: Number,
      default: 0
    },
    // Delay tracking
    delayMinutes: {
      type: Number,
      default: 0
    },
    lastStopServed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop'
    },
    lastStopServedAt: Date,
    // Driver info (optional)
    driverId: String,
    driverName: String
  },
  { timestamps: true }
);

// Auto-update timestamp on currentLocation change
busSchema.pre('findByIdAndUpdate', function() {
  if (this._update && this._update.currentLocation) {
    this._update.currentLocation.updatedAt = new Date();
  }
});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
