import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { LogOut } from "lucide-react";

export default function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [marks, setMarks] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [
                    studentRes,
                    coursesRes,
                    marksRes,
                    attendanceRes,
                ] = await Promise.all([
                    api.get("/students/me"),
                    api.get("/enrollments/student/me"),
                    api.get("/marks/student/me"),
                    api.get("/attendance/student/me"),
                ]);

                setStudent(studentRes.data.student);
                setCourses(coursesRes.data.courses);
                setMarks(marksRes.data.marks);
                setAttendance(attendanceRes.data.attendance);
            } catch (error) {
                console.error(
                    "Student dashboard error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#05070b] via-[#0a0e14] to-[#05070b] text-white flex items-center justify-center">
                <p className="text-slate-500 tracking-wide">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    const presentCount = attendance.filter(
        (item) => item.status === "present"
    ).length;

    const absentCount = attendance.filter(
        (item) => item.status === "absent"
    ).length;

    const totalAttendance =
        presentCount + absentCount;

    const attendancePercentage =
        totalAttendance > 0
            ? Math.round(
                (presentCount / totalAttendance) * 100
            )
            : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#05070b] via-[#0a0e14] to-[#05070b] text-slate-100">
            <main className="mx-auto max-w-6xl p-8 md:p-12">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-6 border-b border-white/[0.06] pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
                            Student Portal
                        </p>

                        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-white">
                            Welcome,{" "}
                            <span className="text-amber-400">
                                {student?.userId?.name}
                            </span>
                        </h1>

                        <p className="mt-3 text-slate-400">
                            Here's your academic overview.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-transparent font-serif text-xl text-amber-300 md:h-20 md:w-20 md:text-2xl">
                            {student?.userId?.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Student Info */}
                <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] md:p-8">
                    <h2 className="mb-6 font-serif text-lg font-medium text-slate-200">
                        Student Information
                    </h2>

                    <div className="grid gap-6 divide-y divide-white/[0.06] md:grid-cols-4 md:divide-x md:divide-y-0">
                        <div className="md:pr-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Student ID
                            </p>
                            <p className="mt-2 font-medium text-slate-100">
                                {student?.studentId}
                            </p>
                        </div>

                        <div className="pt-6 md:pl-6 md:pt-0 md:pr-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Email
                            </p>
                            <p className="mt-2 font-medium text-slate-100">
                                {student?.userId?.email}
                            </p>
                        </div>

                        <div className="pt-6 md:pl-6 md:pt-0 md:pr-6">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Department
                            </p>
                            <p className="mt-2 font-medium text-slate-100">
                                {student?.department}
                            </p>
                        </div>

                        <div className="pt-6 md:pl-6 md:pt-0">
                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Semester
                            </p>
                            <p className="mt-2 font-medium text-slate-100">
                                {student?.semester}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
                        <div className="mb-4 h-0.5 w-8 rounded-full bg-indigo-400/70" />
                        <p className="text-sm text-slate-500">
                            Courses
                        </p>

                        <p className="mt-2 font-serif text-4xl font-medium text-white">
                            {courses.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.08] to-white/[0.02] p-6 ring-1 ring-amber-400/10">
                        <div className="mb-4 h-0.5 w-8 rounded-full bg-amber-400" />
                        <p className="text-sm text-amber-200/80">
                            Attendance
                        </p>

                        <p className="mt-2 font-serif text-4xl font-medium text-amber-300">
                            {attendancePercentage}%
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            <span className="text-emerald-400">
                                {presentCount} Present
                            </span>{" "}
                            /{" "}
                            <span className="text-rose-400">
                                {absentCount} Absent
                            </span>
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
                        <div className="mb-4 h-0.5 w-8 rounded-full bg-emerald-400/70" />
                        <p className="text-sm text-slate-500">
                            Marks Records
                        </p>

                        <p className="mt-2 font-serif text-4xl font-medium text-white">
                            {marks.length}
                        </p>
                    </div>
                </div>

                {/* Courses */}
                <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 md:p-8">
                    <h2 className="mb-6 font-serif text-lg font-medium text-slate-200">
                        My Courses
                    </h2>

                    {courses.length === 0 ? (
                        <p className="text-slate-500">
                            No courses enrolled.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((enrollment) => {
                                const course =
                                    enrollment.courseId;

                                return (
                                    <div
                                        key={enrollment._id}
                                        className="group rounded-xl border border-white/[0.06] bg-black/20 p-5 transition-colors hover:border-amber-400/30"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                                            {course.courseCode}
                                        </p>

                                        <h3 className="mt-3 font-medium text-slate-100">
                                            {course.courseName}
                                        </h3>

                                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-sm text-slate-500">
                                            <span>
                                                Semester{" "}
                                                {course.semester}
                                            </span>
                                            <span>
                                                {course.credits}{" "}
                                                Credits
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Marks */}
                <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 md:p-8">
                    <h2 className="mb-6 font-serif text-lg font-medium text-slate-200">
                        My Marks
                    </h2>

                    {marks.length === 0 ? (
                        <p className="text-slate-500">
                            No marks available.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 font-medium">
                                            Course
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Exam
                                        </th>
                                        <th className="pb-3 text-right font-medium">
                                            Marks
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {marks.map((mark) => (
                                        <tr
                                            key={mark._id}
                                            className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="py-4 text-indigo-300">
                                                {mark.courseId
                                                    ?.courseCode}
                                            </td>

                                            <td className="py-4 capitalize text-slate-300">
                                                {mark.examType}
                                            </td>

                                            <td className="py-4 text-right font-serif text-lg font-medium text-amber-300">
                                                {mark.marks}
                                                <span className="text-sm text-slate-500">
                                                    /100
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Attendance */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 md:p-8">
                    <h2 className="mb-6 font-serif text-lg font-medium text-slate-200">
                        My Attendance
                    </h2>

                    {attendance.length === 0 ? (
                        <p className="text-slate-500">
                            No attendance records available.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 font-medium">
                                            Course
                                        </th>
                                        <th className="pb-3 font-medium">
                                            Date
                                        </th>
                                        <th className="pb-3 text-right font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {attendance.map((record) => (
                                        <tr
                                            key={record._id}
                                            className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="py-4 text-indigo-300">
                                                {
                                                    record.courseId
                                                        ?.courseCode
                                                }
                                            </td>

                                            <td className="py-4 text-slate-300">
                                                {new Date(
                                                    record.date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="py-4 text-right">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${record.status ===
                                                            "present"
                                                            ? "bg-emerald-400/10 text-emerald-300"
                                                            : "bg-rose-400/10 text-rose-300"
                                                        }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}