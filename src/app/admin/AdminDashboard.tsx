'use client';

import { useState, useEffect } from 'react';
import type { Product, PromoLink } from '@/lib/db';
import { generateShareLink, fetchAllLinks } from './actions';

type Props = {
    initialProducts: Product[];
    initialLinks: PromoLink[];
};

export default function AdminDashboard({ initialProducts, initialLinks }: Props) {
    const [links, setLinks] = useState<PromoLink[]>(initialLinks);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Polling to update link tracking real-time without reloading
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const freshLinks = await fetchAllLinks();
                setLinks(freshLinks);
            } catch (error) {
                console.error('Failed to poll links:', error);
            }
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, []);

    // share form state
    const [linkType, setLinkType] = useState<'normal' | 'promotional'>('normal');
    const [linkName, setLinkName] = useState('');

    // result state
    const [generatedUrl, setGeneratedUrl] = useState('');

    const handleShareClick = (product: Product) => {
        setSelectedProduct(product);
        setLinkType('normal');
        setLinkName('');
        setGeneratedUrl('');
        setModalOpen(true);
    };

    const handleCreateLink = async () => {
        if (!selectedProduct) return;

        // Default name for normal links or if empty
        const finalName = linkType === 'promotional' && linkName ? linkName : `Link for ${selectedProduct.name}`;

        const newLink = await generateShareLink(selectedProduct.id, finalName, linkType);
        setGeneratedUrl(newLink.url);

        // Update local state to immediately show in table without full reload
        setLinks([newLink, ...links]);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' })
            });
            window.location.href = '/';
        } catch (err) {
            console.error('Failed to log out', err);
            setIsLoggingOut(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="container">
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Admin Dashboard</h1>
                    <p className="text-muted">Manage products and generate promotional tracking links.</p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                >
                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                </button>
            </div>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Available Products</h2>
            <div className="card-grid" style={{ marginBottom: '4rem' }}>
                {initialProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                        <div className="product-content">
                            <h3 className="product-title">{product.name}</h3>
                            <p className="product-price">${product.price.toFixed(2)}</p>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleShareClick(product)}>
                                Share Product
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Active Links & Tracking</h2>
            {links.length === 0 ? (
                <div className="glass-panel text-center text-muted">
                    No tracking links have been generated yet.
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Link Name</th>
                                <th>Type</th>
                                <th>URL</th>
                                <th style={{ textAlign: 'center' }}>Clicks</th>
                                {/* <th style={{ textAlign: 'center' }}>Signups</th> */}
                                <th style={{ textAlign: 'center' }}>Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map(link => (
                                <tr key={link.id}>
                                    <td style={{ fontWeight: '500' }}>{link.name}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: link.type === 'promotional' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                            color: link.type === 'promotional' ? 'var(--primary)' : 'var(--text-muted)'
                                        }}>
                                            {link.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <a href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                            {link.url}
                                        </a>
                                    </td>
                                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{link.clicks}</td>
                                    {/* <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>{link.signups || 0}</td> */}
                                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--success)' }}>{link.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Share Modal */}
            {modalOpen && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Share {selectedProduct.name}</h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Generate a link to share this product with others.</p>

                        {!generatedUrl ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Link Type</label>
                                    <select
                                        className="input"
                                        value={linkType}
                                        onChange={e => setLinkType(e.target.value as 'normal' | 'promotional')}
                                    >
                                        <option value="normal">Normal Link</option>
                                        <option value="promotional">Promotional Link (Tracked)</option>
                                    </select>
                                </div>

                                {linkType === 'promotional' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Save As (Campaign Name)
                                        </label>
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="e.g. Summer Sale Instagram"
                                            value={linkName}
                                            onChange={e => setLinkName(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreateLink}>
                                        Generate Link
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '1rem' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Link Generated!</h3>
                                    <p className="text-muted">You can now share this link with your audience.</p>
                                </div>

                                <div style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', wordBreak: 'break-all' }}>
                                    <a href={generatedUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '500' }}>{generatedUrl}</a>
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
