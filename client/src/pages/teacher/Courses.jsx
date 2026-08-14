import { useEffect, useState } from "react";
import api from "../../services/api";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get("/courses/teacher/me");

                setCourses(response.data.courses);
            } catch (error) {
                console.error("Failed to fetch teacher courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <TeacherSidebar />

            <main className="ml-64 p-8">
                <div className="mb-8">
                    <p className="mb-2 text-sm text-neutral-500">
                        Academic Management
                    </p>

                    <h1 className="text-3xl font-bold">
                        My Courses
                    </h1>

                    <p className="mt-2 text-neutral-400">
                        Courses assigned to you.
                    </p>
                </div>

                {loading ? (
                    <p className="text-neutral-400">
                        Loading courses...
                    </p>
                ) : courses.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
                        <p className="text-neutral-400">
                            No courses assigned to you.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
                            >
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
                                        {course.courseCode.slice(0, 2)}
                                    </div>

                                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-neutral-400">
                                        {course.credits} Credits
                                    </span>
                                </div>

                                <p className="text-sm font-medium text-blue-400">
                                    {course.courseCode}
                                </p>

                                <h2 className="mt-2 text-xl font-semibold">
                                    {course.courseName}
                                </h2>

                                <div className="mt-5 space-y-2 text-sm text-neutral-400">
                                    <p>
                                        Department:{" "}
                                        <span className="text-neutral-200">
                                            {course.department}
                                        </span>
                                    </p>

                                    <p>
                                        Semester:{" "}
                                        <span className="text-neutral-200">
                                            {course.semester}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}