import {
    LayoutDashboard,
    Users,
    BookOpen,
    ClipboardCheck,
    FileText,
    LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TeacherSidebar() {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/teacher",
        },
        {
            label: "Students",
            icon: Users,
            path: "/teacher/students",
        },
        {
            label: "Courses",
            icon: BookOpen,
            path: "/teacher/courses",
        },
        {
            label: "Attendance",
            icon: ClipboardCheck,
            path: "/teacher/attendance",
        },
        {
            label: "Marks",
            icon: FileText,
            path: "/teacher/marks",
        },
    ];

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-neutral-950 p-5 text-white">
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
                    SIS
                </div>

                <div>
                    <p className="font-semibold">
                        Student Info
                    </p>

                    <p className="text-xs text-neutral-500">
                        Teacher
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-neutral-400 transition hover:bg-white/10 hover:text-white"
                        >
                            <Icon size={18} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
                <LogOut size={18} />
                Logout
            </button>
        </aside>
    );
}