const { Schema, model, models } = require('mongoose');

const blockSchema = new Schema({
  name: String,
  type: {
    type: String,
    required: true,
    enum: ['storage', 'buffer', 'bufferClean'],
    default: 'storage',
  },
  startX: { type: Number, required: true },
  startY: { type: Number, required: true },
  startZ: { type: Number, required: true },
  endX: { type: Number, required: true },
  endY: { type: Number, required: true },
  endZ: { type: Number, required: true },
  sections: [{ type: Schema.Types.ObjectId, ref: 'sections', required: true }],
});

const Block = model('Blocks', blockSchema);
module.exports = Block;
