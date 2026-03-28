import mongoose from 'mongoose';

// Stop Schema - Defines bus stops/stations
const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stop name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Stop code is required'],
      unique: true,
      trim: true
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    },
    address: String,
    amenities: [String], // e.g., ['shelter', 'bench', 'lighting', 'wheelchair_accessible']
    zone: String, // For fare calculation
    routes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
      }
    ],
    parent_stop_id: mongoose.Schema.Types.ObjectId, // For multi-stop stations
    accessibility: {
      wheelchair_accessible: {
        type: Boolean,
        default: false
      },
      visual_aid: {
        type: Boolean,
        default: false
      },
      elevator: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

// Geospatial Index for nearby stops query
stopSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

const Stop = mongoose.model('Stop', stopSchema);

export default Stop;
