import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  experienceLevel: {
    type: String,
    enum: ['first_timer', 'somewhat_familiar', 'know_my_cycle'],
    default: 'somewhat_familiar',
  },
  ageRange: { type: String, enum: ['13-17', '18-25', '26-35', '36+'], default: '18-25' },
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  lastPeriodDate: { type: String, default: null }, // ISO date (YYYY-MM-DD)
  isIrregular: { type: Boolean, default: false },
  trackedSymptoms: { type: [String], default: [] },
  notificationPrefs: { type: Schema.Types.Mixed, default: {} },
  partnerId: { type: Schema.Types.ObjectId, ref: 'PartnerAccount', default: null },
  createdAt: { type: Date, default: Date.now },
});

export type UserDoc = InferSchemaType<typeof UserSchema>;

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
