const { Schema, model } = require('mongoose');

const VertexSchema = new Schema({
  locationX: { type: 'number', required: true },
  locationY: { type: 'number', required: true },
  locationZ: { type: 'number', required: true },
});

const Vertex = model('Vertexs', VertexSchema);
module.exports = Vertex;
