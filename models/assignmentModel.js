const { Schema, model } = require('mongoose');

const assignmentSchema = new Schema({
  task: { type: Schema.Types.ObjectId, ref: 'Tasks', required: true },
  routeStart: {
    type: String,
    enum: ['park', 'sectionStart', 'sectionEnd', 'sectionBuffer', 'road'],
    required: true,
  },
  routeEnd: {
    type: String,
    enum: ['park', 'sectionStart', 'road', 'sectionBuffer', 'sectionEnd'],
    required: true,
  },
  agv: { type: Schema.Types.ObjectId, ref: 'Agvs', required: true },
  route: [{ type: String }],
  z: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  status: {
    type: String,
    required: true,
    default: 'transport',
    enum: ['waitForExecute', 'transport', 'complete'],
  },
});

assignmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'agv',
    select: 'name',
  });
  next();
});

const Assignment = model('Assignments', assignmentSchema);
module.exports = Assignment;
