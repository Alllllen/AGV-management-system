const { Schema, model } = require('mongoose');

const doorSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['airShowerDoor', 'automaticDoor'],
    default: 'automaticDoor',
  },
  name: String,
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  entries: [{ entryX: Number, entryY: Number }],
  z: { type: Number, required: true },
  status: { type: String, required: true }, //電梯狀態：idleFloor, active //電動門狀態： close, open
});

const Door = model('Doors', doorSchema);
module.exports = Door;
