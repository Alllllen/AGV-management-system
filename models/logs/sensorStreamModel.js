const { Schema, model } = require('mongoose');

const sensorStreamSchema = new Schema({
  sensor: { type: Schema.Types.ObjectId, ref: 'Sensors', required: true },
  createdAt: { type: Date, require: true, default: Date.now() },
  status: { type: String, required: true },
});

const SensorStream = model('SensorStreams', sensorStreamSchema);
module.exports = SensorStream;
