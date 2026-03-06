import { getProductById } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import ProductClientPage from './ProductClientPage';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Product Details | Aura',
};

export default async function ProductPage({ params, searchParams }: { params: { id: string }, searchParams: { ref?: string } }) {
    const { id } = await params;
    const ref = (await searchParams).ref;

    // Enforce login so no one can view the product without an account
    const session = await getSession();
    if (!session) {
        const redirectUrl = encodeURIComponent(`/product/${id}${ref ? `?ref=${ref}` : ''}`);
        redirect(`/admin?redirect=${redirectUrl}`);
    }

    // Now database calls are async due to Mongoose
    const product = await getProductById(id);

    if (!product) {
        return notFound();
    }

    // Need to serialize Mongoose doc
    const serializedProduct = JSON.parse(JSON.stringify(product));

    return <ProductClientPage product={serializedProduct} refId={ref} />;
}
