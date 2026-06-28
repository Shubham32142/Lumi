import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const PainSchema = new Schema(
  {
    type: { type: String, enum: ['cramps', 'headache', 'back_pain', 'breast_tenderness'] },
    intensity: { type: Number, min: 1, max: 5 },
  },
  { _id: false },
);

const CycleLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true }, // ISO date (YYYY-MM-DD)
  phase: { type: String, enum: ['menstruation', 'follicular', 'ovulation', 'luteal'] },
  mood: String,
  energy: String,
  pain: { type: [PainSchema], default: undefined },
  cravings: { type: [String], default: undefined },
  bloating: String,
  sleepQuality: String,
  flowIntensity: String,
  mentalClarity: String,
  socialBattery: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// One log per user per day.
CycleLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export type CycleLogDoc = InferSchemaType<typeof CycleLogSchema>;

export const CycleLog =
  mongoose.models.CycleLog || mongoose.model('CycleLog', CycleLogSchema);
