const { Schema, model } = require('mongoose');

const parkSchema = new Schema({
  name: String,
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  entryX: { type: Number, required: true },
  entryY: { type: Number, required: true },
  z: { type: Number, required: true },
});

const Park = model('Parks', parkSchema);
module.exports = Park;
