import { useEffect, useState } from "react";
import api from "../../services/api";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import {
    CalendarCheck,
    CheckCircle2,
    XCircle,
    Loader2,
} from "lucide-react";

export default function Attendance() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [courseId, setCourseId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [status, setStatus] = useState("present");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, studentsRes] = await Promise.all([
                    api.get("/courses/teacher/me"),
                    api.get("/enrollments/teacher/me"),
                ]);

                setCourses(coursesRes.data.courses);
                setStudents(studentsRes.data.students);
            } catch (error) {
                console.error(
                    "Failed to fetch teacher attendance data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!courseId || !studentId || !date) {
            alert("Please select course, student and date.");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/attendance", {
                studentId,
                courseId,
                date,
                status,
            });

            alert("Attendance marked successfully.");

            setStudentId("");
            setStatus("present");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to mark attendance"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = students.filter(
        (enrollment) =>
            enrollment.courseId?._id === courseId
    );

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <TeacherSidebar />

            <main className="ml-64 p-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                        <CalendarCheck className="h-6 w-6 text-violet-400" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Attendance
                        </h1>

                        <p className="mt-1 text-neutral-400">
                            Mark attendance for your students.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 text-neutral-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-4xl rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                    >
                        <h2 className="mb-6 text-xl font-semibold">
                            Mark Attendance
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Course */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Course
                                </label>

                                <select
                                    value={courseId}
                                    onChange={(e) => {
                                        setCourseId(e.target.value);
                                        setStudentId("");
                                    }}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-violet-400/50"
                                >
                                    <option value="">
                                        Select Course
                                    </option>

                                    {courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}
                                        >
                                            {course.courseCode} —{" "}
                                            {course.courseName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Student */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Student
                                </label>

                                <select
                                    value={studentId}
                                    onChange={(e) =>
                                        setStudentId(e.target.value)
                                    }
                                    required
                                    disabled={!courseId}
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none disabled:opacity-50 focus:border-violet-400/50"
                                >
                                    <option value="">
                                        {courseId
                                            ? "Select Student"
                                            : "Select Course First"}
                                    </option>

                                    {filteredStudents.map(
                                        (enrollment) => (
                                            <option
                                                key={
                                                    enrollment.studentId
                                                        ._id
                                                }
                                                value={
                                                    enrollment.studentId
                                                        ._id
                                                }
                                            >
                                                {
                                                    enrollment
                                                        .studentId
                                                        .userId
                                                        .name
                                                }{" "}
                                                —{" "}
                                                {
                                                    enrollment
                                                        .studentId
                                                        .studentId
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-violet-400/50"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-violet-400/50"
                                >
                                    <option value="present">
                                        Present
                                    </option>

                                    <option value="absent">
                                        Absent
                                    </option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
                        >
                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {submitting
                                ? "Marking..."
                                : "Mark Attendance"}
                        </button>
                    </form>
                )}

                {/* Students Preview */}
                {!loading && courseId && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04]">
                        <div className="border-b border-white/10 px-6 py-5">
                            <h2 className="text-xl font-semibold">
                                Enrolled Students
                            </h2>
                        </div>

                        <div className="divide-y divide-white/5">
                            {filteredStudents.length === 0 ? (
                                <p className="p-6 text-neutral-400">
                                    No students enrolled in this course.
                                </p>
                            ) : (
                                filteredStudents.map(
                                    (enrollment) => {
                                        const student =
                                            enrollment.studentId;

                                        return (
                                            <div
                                                key={
                                                    enrollment._id
                                                }
                                                className="flex items-center justify-between px-6 py-4"
                                            >
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
                                                            student.studentId
                                                        }
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                                    Present

                                                    <XCircle className="ml-3 h-4 w-4 text-red-400" />
                                                    Absent
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}