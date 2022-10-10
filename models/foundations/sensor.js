const { Schema, model } = require('mongoose');

const sensorSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['elevator', 'airShowerDoor', 'AutimaticDoor', 'Warnlight'],
    default: 'elevator',
  },
  name: String,
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  startZ: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  endZ: { type: Number, required: true },
  entryX: { type: Number, required: true },
  entryY: { type: Number, required: true },
  entryZ: { type: Number, required: true },
  status: { type: String, required: true },
});

const Sensor = model('Sensors', sensorSchema);
module.exports = Sensor;
