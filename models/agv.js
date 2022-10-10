const { Schema, model } = require('mongoose');

const agvSchema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['charge', 'transport', 'park', 'backPark', 'backCharge'],
    default: 'park',
  },
  battery: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 0 },
  locationX: { type: Number, required: true },
  locationY: { type: Number, required: true },
});

const Agv = model('Agvs', agvSchema);
module.exports = Agv;
