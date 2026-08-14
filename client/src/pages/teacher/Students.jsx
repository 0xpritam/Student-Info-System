import { useEffect, useState } from "react";
import api from "../../services/api";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get("/enrollments/teacher/me");

                setStudents(response.data.students);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
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
                        My Students
                    </h1>

                    <p className="mt-2 text-neutral-400">
                        Students enrolled in your courses.
                    </p>
                </div>

                {loading ? (
                    <p className="text-neutral-400">
                        Loading students...
                    </p>
                ) : students.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
                        <p className="text-neutral-400">
                            No students enrolled yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-white/10 bg-white/[0.04]">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">
                                            Student
                                        </th>
                                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">
                                            Student ID
                                        </th>
                                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">
                                            Department
                                        </th>
                                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">
                                            Semester
                                        </th>
                                        <th className="px-6 py-4 text-sm font-medium text-neutral-400">
                                            Course
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map((enrollment) => {
                                        const student =
                                            enrollment.studentId;

                                        const course =
                                            enrollment.courseId;

                                        return (
                                            <tr
                                                key={enrollment._id}
                                                className="border-b border-white/5 transition hover:bg-white/[0.04]"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                student
                                                                    .userId
                                                                    .name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-neutral-500">
                                                            {
                                                                student
                                                                    .userId
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-neutral-300">
                                                    {student.studentId}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-neutral-300">
                                                    {student.department}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-neutral-300">
                                                    {student.semester}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                                                        {
                                                            course.courseCode
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}