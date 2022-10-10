const { Schema, model } = require('mongoose');

const guidePathSchema = new Schema({
  vertex: {
    type: Schema.Types.ObjectId,
    ref: 'Vertexs',
    required: true,
  },
  adjacents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Vertexs',
      required: true,
    },
  ],
});

const GuideEdge = model('GuidePath', guidePathSchema);
module.exports = GuidePath;
