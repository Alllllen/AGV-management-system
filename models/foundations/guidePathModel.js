const { Schema, model } = require('mongoose');

const guidePathSchema = new Schema({
  vertex: {
    type: Schema.Types.ObjectId,
    ref: 'Vertexs',
    required: true,
  },
  vertexX: { type: Number, required: true },
  vertexY: { type: Number, required: true },
  vertexZ: { type: Number, required: true },
  adjacents: [
    {
      adjacentId: { type: Schema.Types.ObjectId, ref: 'Vertexs' },
      adjacentX: Number,
      adjacentY: Number,
      adjacentZ: Number,
    },
  ],
});

const GuidePath = model('GuidePath', guidePathSchema);
module.exports = GuidePath;
