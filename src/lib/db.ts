import connectDB from './mongoose';
import ProductModel from '@/models/Product';
import PromoLinkModel from '@/models/PromoLink';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type PromoLink = {
  id: string;
  productId: string;
  userId: string;
  name: string;
  url: string;
  clicks: number;
  orders: number;
  signups: number;
  createdAt: string;
  type: 'normal' | 'promotional';
};

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Aesthetic Mechanical Keyboard",
    description: "A premium 75% layout mechanical keyboard with hot-swappable switches and custom PBT keycaps. Perfect for typing and aesthetics.",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p2",
    name: "Minimalist Desk Mat",
    description: "An ultra-smooth, premium felt desk mat that protects your workspace and adds a touch of elegance to your setup.",
    price: 34.00,
    imageUrl: "https://images.unsplash.com/photo-1541123437800-141315147570?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p3",
    name: "Ergonomic Office Chair",
    description: "Designed for all-day comfort with breathable mesh, lumbar support, and adjustable armrests.",
    price: 399.00,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "p4",
    name: "Wireless Charging Stand",
    description: "Sleek aluminum charging stand capable of fast-charging your phone, watch, and earbuds simultaneously.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=800"
  }
];

export const seedProducts = async () => {
  await connectDB();
  const count = await ProductModel.countDocuments();
  if (count === 0) {
    await ProductModel.insertMany(initialProducts);
  }
};

export const getProducts = async () => {
  await seedProducts();
  const products = await ProductModel.find({}).lean();
  return products.map(p => ({
    ...p,
    _id: p._id.toString()
  }));
};

export const getProductById = async (id: string) => {
  await connectDB();
  const product = await ProductModel.findOne({ id }).lean();
  if (!product) return null;
  return { ...product, _id: product._id.toString() };
};

export const getLinks = async (userId: string) => {
  await connectDB();
  const links = await PromoLinkModel.find({ userId }).sort({ createdAt: -1 }).lean();
  return links.map(l => ({
    ...l,
    _id: l._id.toString(),
    userId: l.userId.toString()
  }));
};

export const createLink = async (productId: string, name: string, type: 'normal' | 'promotional', userId: string) => {
  await connectDB();
  const id = Math.random().toString(36).substring(2, 9);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/product/${productId}?ref=${id}`;

  const link = await PromoLinkModel.create({
    id,
    productId,
    userId,
    name,
    url,
    type,
    clicks: 0,
    orders: 0,
    signups: 0
  });

  return link.toObject();
};

export const recordClick = async (linkId: string) => {
  await connectDB();
  const result = await PromoLinkModel.findOneAndUpdate(
    { id: linkId },
    { $inc: { clicks: 1 } }
  );
  return !!result;
};

export const recordOrder = async (linkId: string) => {
  await connectDB();
  const result = await PromoLinkModel.findOneAndUpdate(
    { id: linkId },
    { $inc: { orders: 1 } }
  );
  return !!result;
};

export const recordSignup = async (linkId: string) => {
  await connectDB();
  const result = await PromoLinkModel.findOneAndUpdate(
    { id: linkId },
    { $inc: { signups: 1 } }
  );
  return !!result;
};
