import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Students from "./pages/admin/Students";
import AdminLayout from "./layouts/AdminLayout";
import Teachers from "./pages/admin/Teachers";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={
                        <AdminLayout>
                            <AdminDashboard />
                        </AdminLayout>
                    }
                />

                <Route
                    path="/admin/students"
                    element={
                        <AdminLayout>
                            <Students />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/teachers"
                    element={
                        <AdminLayout>
                            <Teachers />
                        </AdminLayout>
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;