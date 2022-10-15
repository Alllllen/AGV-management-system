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
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  entryX: { type: Number, required: true },
  entryY: { type: Number, required: true },
  z: { type: Number, required: true },
  status: { type: String, required: true }, //電梯狀態：idleFloor, active //電動門狀態： close, open
});

const Sensor = model('Sensors', sensorSchema);
module.exports = Sensor;
