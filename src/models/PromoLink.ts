import mongoose from 'mongoose';

const PromoLinkSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    signups: { type: Number, default: 0 },
    type: { type: String, enum: ['normal', 'promotional'], required: true }
}, { timestamps: true });

export default mongoose.models.PromoLink || mongoose.model('PromoLink', PromoLinkSchema);
