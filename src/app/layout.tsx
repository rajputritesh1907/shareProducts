import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aura Products | Premium Sharing',
  description: 'Share premium products and track engagement.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="navbar-container">
            <Link href="/" className="navbar-brand gradient-text">
              Aura Products
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link">Store</Link>
              <Link href="/admin" className="nav-link">Admin Dashboard</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
