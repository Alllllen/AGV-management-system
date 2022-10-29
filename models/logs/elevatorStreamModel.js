const { Schema, model } = require('mongoose');

const elevatorStreamSchema = new Schema({
  elevator: { type: Schema.Types.ObjectId, ref: 'Elevators', required: true },
  createdAt: { type: Date, require: true, default: Date.now() },
  status: { type: String, required: true },
});

const ElevatorStream = model('ElevatorStreams', elevatorStreamSchema);
module.exports = ElevatorStream;
