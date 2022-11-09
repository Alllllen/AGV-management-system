const { Schema, model } = require('mongoose');

const agvStreamSchema = new Schema({
  agv: { type: Schema.Types.ObjectId, ref: 'Agvs', required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  status: {
    type: String,
    required: true,
    enum: ['active', 'idle', 'charging', 'parking'],
  },
  battery: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 0 },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
});

const AgvStream = model('AgvStreams', agvStreamSchema);
module.exports = AgvStream;
