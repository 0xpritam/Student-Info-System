import { useEffect, useState } from "react";
import api from "../../services/api";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";

export default function TeacherDashboard() {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const response = await api.get("/teachers/me");

                setTeacher(response.data.teacher);
            } catch (error) {
                console.error("Teacher dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white">
                <TeacherSidebar />

                <main className="ml-64 flex min-h-screen items-center justify-center">
                    <p className="text-neutral-400">
                        Loading dashboard...
                    </p>
                </main>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white">
                <TeacherSidebar />

                <main className="ml-64 flex min-h-screen items-center justify-center">
                    <p className="text-red-400">
                        Unable to load teacher profile.
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <TeacherSidebar />

            <main className="ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm text-neutral-500">
                        Teacher Dashboard
                    </p>

                    <h1 className="text-3xl font-bold">
                        Welcome back, {teacher.userId.name} 👋
                    </h1>

                    <p className="mt-2 text-neutral-400">
                        Manage your academic activities and student
                        information.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-500">
                                Teacher ID
                            </p>

                            <h2 className="mt-1 text-xl font-semibold">
                                {teacher.teacherId}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                            Teacher
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]">
                        <p className="text-sm text-neutral-500">
                            Department
                        </p>

                        <p className="mt-3 text-lg font-semibold">
                            {teacher.department}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/[0.07]">
                        <p className="text-sm text-neutral-500">
                            Subject
                        </p>

                        <p className="mt-3 text-lg font-semibold">
                            {teacher.subject}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-white/[0.07]">
                        <p className="text-sm text-neutral-500">
                            Email
                        </p>

                        <p className="mt-3 break-all text-lg font-semibold">
                            {teacher.userId.email}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <button
                            onClick={() =>
                                window.location.href =
                                    "/teacher/attendance"
                            }
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
                        >
                            <p className="text-lg font-semibold">
                                Attendance
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                Mark and manage student attendance.
                            </p>
                        </button>

                        <button
                            onClick={() =>
                                window.location.href =
                                    "/teacher/marks"
                            }
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left transition hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/[0.07]"
                        >
                            <p className="text-lg font-semibold">
                                Marks
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                Add and manage student marks.
                            </p>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}