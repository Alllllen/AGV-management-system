const { Schema, model } = require('mongoose');

const taskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  sectionStart: {
    type: Schema.Types.ObjectId,
    ref: 'Sections',
    required: true,
  },
  sectionEnd: { type: Schema.Types.ObjectId, ref: 'Sections', required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  status: {
    type: String,
    required: true,
    default: 'waitForExectue',
    enum: ['waitForExectue', 'execute', 'waitAtBuffer', 'complete'],
  },
});

const Task = model('Tasks', taskSchema);

module.exports = Task;
