import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const PartnerAccountSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  linkedUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  // Categories the user has consented to share (e.g. ['mood', 'energy']).
  sharedFields: { type: [String], default: ['mood', 'energy'] },
  createdAt: { type: Date, default: Date.now },
});

export type PartnerAccountDoc = InferSchemaType<typeof PartnerAccountSchema>;

export const PartnerAccount =
  mongoose.models.PartnerAccount || mongoose.model('PartnerAccount', PartnerAccountSchema);
