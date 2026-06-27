const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true
    },
    category: {
      type: String,
      trim: true,
      index: true
    },
    downloadCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true 
  }
);

// Índices para búsqueda y filtrado
fileSchema.index({ userId: 1, createdAt: -1 });
fileSchema.index({ category: 1 });
fileSchema.index({ mimetype: 1 });

module.exports = mongoose.model('File', fileSchema);
