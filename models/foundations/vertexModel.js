const { Schema, model } = require('mongoose');

const VertexSchema = new Schema({
  x: { type: 'number', required: true },
  y: { type: 'number', required: true },
  z: { type: 'number', required: true },
});

const Vertex = model('Vertexs', VertexSchema);
module.exports = Vertex;
