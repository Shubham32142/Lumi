import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const ArticleSchema = new Schema({
  phase: {
    type: String,
    enum: ['menstruation', 'follicular', 'ovulation', 'luteal'],
    required: true,
  },
  category: {
    type: String,
    enum: ['hormones', 'eat', 'move', 'sleep', 'emotional', 'doctor'],
    required: true,
  },
  title: { type: String, required: true },
  body: { type: [String], default: [] }, // paragraphs
  readTimeMinutes: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  isBookmarkedBy: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
});

export type ArticleDoc = InferSchemaType<typeof ArticleSchema>;

export const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
