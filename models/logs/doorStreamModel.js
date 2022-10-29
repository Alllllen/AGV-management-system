const { Schema, model } = require('mongoose');

const doorStreamSchema = new Schema({
  door: { type: Schema.Types.ObjectId, ref: 'Doors', required: true },
  createdAt: { type: Date, require: true, default: Date.now() },
  status: { type: String, required: true },
});

const DoorStream = model('DoorStreams', doorStreamSchema);
module.exports = DoorStream;
