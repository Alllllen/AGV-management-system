const { Schema, model } = require('mongoose');

const elevatorSchema = new Schema({
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

const Elevator = model('Elevators', elevatorSchema);
module.exports = Elevator;
