const { Schema, model } = require('mongoose');

const wallSchema = new Schema({
  name: String,
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  startZ: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  endZ: { type: Number, required: true },
});

const Wall = model('Walls', wallchema);
module.exports = wall;
