import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <AdminSidebar />

            <main className="ml-64 min-h-screen p-8">
                {children}
            </main>
        </div>
    );
}