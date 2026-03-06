'use client';

import { useEffect, useState, useRef } from 'react';
import type { Product } from '@/lib/db';

type Props = {
    product: Product;
    refId?: string;
};

export default function ProductClientPage({ product, refId }: Props) {
    const [isOrdering, setIsOrdering] = useState(false);
    const [ordered, setOrdered] = useState(false);
    const hasTrackedClick = useRef(false);

    useEffect(() => {
        // Determine if we need to track a click for a promotional link
        if (refId && typeof window !== 'undefined' && !hasTrackedClick.current) {
            hasTrackedClick.current = true;
            fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'click', refId })
            }).catch(err => console.error('Failed to track click', err));
        }
    }, [refId]);

    const handleOrder = async () => {
        setIsOrdering(true);

        // Track the order if there is a referrer refId
        if (refId) {
            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'order', refId })
                });
            } catch (err) {
                console.error('Failed to track order', err);
            }
        }

        // Simulate an ordering delay for UX
        setTimeout(() => {
            setIsOrdering(false);
            setOrdered(true);
        }, 800);
    };

    return (
        <div className="container" style={{ maxWidth: '900px', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* Product Image Section */}
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
                    />
                </div>

                {/* Product Details Section */}
                <div style={{ padding: '0 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{product.name}</h1>
                        <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>${product.price.toFixed(2)}</p>
                    </div>

                    <p className="text-muted" style={{ fontSize: '1.125rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        {product.description}
                    </p>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Ready to elevate your setup?</p>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Fast, secure checkout.</p>
                        </div>

                        <button
                            className={`btn ${ordered ? 'btn-secondary' : 'btn-primary'}`}
                            style={{ padding: '0.875rem 2.5rem', fontSize: '1.1rem' }}
                            onClick={handleOrder}
                            disabled={isOrdering || ordered}
                        >
                            {isOrdering ? 'Processing...' : ordered ? 'Order Placed ✓' : 'Order Now'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
