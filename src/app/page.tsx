import { getProducts } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Aura Products | Premium Store',
};

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>
          Elevate Your Workspace
        </h1>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover our curated selection of premium desk accessories and ergonomic gear designed for modern professionals.
        </p>
      </div>

      <div className="card-grid">
        {products.map(product => (
          <Link href={`/product/${product.id}`} key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-content">
              <h3 className="product-title">{product.name}</h3>
              <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="product-price" style={{ margin: 0 }}>${product.price.toFixed(2)}</span>
                <span className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
