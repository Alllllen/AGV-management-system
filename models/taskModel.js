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
    default: 'waitForExecute',
    enum: ['waitForExecute', 'execute', 'waitAtBuffer', 'complete'],
  },
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'sectionStart',
    select: 'name entryX entryY',
  });

  this.populate({
    path: 'sectionEnd',
    select: 'name entryX entryY',
  });

  this.populate({
    path: 'user',
    select: 'email name',
  });
  next();
});

// postSchema.pre(/findOne/, function (next) {
//   this.populate({
//     path: 'comments',
//   });

const Task = model('Tasks', taskSchema);

module.exports = Task;
