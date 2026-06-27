const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resourceType: {
      type: String,
      enum: ['character', 'location', 'episode'],
      required: true,
      lowercase: true,
      index: true
    },
    resourceId: {
      type: Number,
      required: true,
      index: true
    },
    notes: {
      type: String,
      maxlength: 500,
      trim: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índice único para evitar duplicados por usuario
favoriteSchema.index(
  { userId: 1, resourceType: 1, resourceId: 1 }, 
  { unique: true }
);

// Índice para búsqueda de texto
favoriteSchema.index({ notes: 'text' });

// Índice compuesto para filtros y ordenamiento
favoriteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
