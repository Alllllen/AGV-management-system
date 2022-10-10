const { Schema, model } = require('mongoose');

const sectionSchema = new Schema({
  name: { type: String, required: true },
  entryX: { type: Number, required: true },
  entryY: { type: Number, required: true },
  entryZ: { type: Number, required: true },
  isEmpty: { type: Boolean, required: true, default: true },
});

const Section = model('Sections', sectionSchema);

module.exports = Section;
