import { getProducts, getLinks } from '@/lib/db';
import AdminDashboard from './AdminDashboard';
import AuthPage from '@/components/AuthPage';
import { getSession } from '@/lib/auth';

export const metadata = {
    title: 'Admin Dashboard | Aura',
    description: 'Manage products and generate tracking links.',
};

export default async function AdminPage() {
    const session = await getSession();

    // Show login/signup component if the user isn't logged in, without changing the URL.
    if (!session) {
        return <AuthPage />;
    }

    const products = await getProducts();
    const links = await getLinks(session.userId as string);

    // Serialize for Client Component
    const serializedProducts = JSON.parse(JSON.stringify(products));
    const serializedLinks = JSON.parse(JSON.stringify(links));

    return <AdminDashboard initialProducts={serializedProducts} initialLinks={serializedLinks} />;
}
