import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [status, setStatus] = useState("present");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
    try {
        const [studentsRes, coursesRes] = await Promise.all([
            api.get("/students"),
            api.get("/courses"),
        ]);

        setStudents(studentsRes.data.students);
        setCourses(coursesRes.data.courses);
    } catch (error) {
        console.error("Failed to fetch students/courses:", error);
    }

    try {
        const attendanceRes = await api.get("/attendance");

        setAttendance(attendanceRes.data.attendance);
    } catch (error) {
        console.error("Failed to fetch attendance:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !courseId || !date) {
            alert("Please select student, course and date.");
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

            setStudentId("");
            setCourseId("");
            setStatus("present");

            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to mark attendance"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Attendance
                </h1>

                <p className="mt-1 text-neutral-400">
                    Mark and monitor student attendance.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
                <h2 className="mb-6 text-xl font-semibold">
                    Mark Attendance
                </h2>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                        >
                            <option value="">
                                Select Student
                            </option>

                            {students.map((student) => (
                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.userId?.name} —{" "}
                                    {student.studentId}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-neutral-400">
                            Course
                        </label>

                        <select
                            value={courseId}
                            onChange={(e) =>
                                setCourseId(e.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
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
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-neutral-400">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
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
                    className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting
                        ? "Marking..."
                        : "Mark Attendance"}
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="border-b border-white/10 px-6 py-5">
                    <h2 className="text-xl font-semibold">
                        Attendance Records
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                            <tr className="text-left text-sm text-neutral-400">
                                <th className="px-6 py-4">
                                    Student
                                </th>

                                <th className="px-6 py-4">
                                    Course
                                </th>

                                <th className="px-6 py-4">
                                    Date
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : attendance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((record) => {
                                    const student = students.find(
                                        (item) =>
                                            item._id ===
                                            record.studentId
                                    );

                                    return (
                                        <tr
                                            key={record._id}
                                            className="border-b border-white/5 hover:bg-white/[0.03]"
                                        >
                                            <td className="px-6 py-4">
                                                {student?.userId?.name ||
                                                    "Unknown Student"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {record.courseId
                                                    ?.courseCode ||
                                                    "-"}
                                                {" — "}
                                                {record.courseId
                                                    ?.courseName ||
                                                    "-"}
                                            </td>

                                            <td className="px-6 py-4">
                                                {new Date(
                                                    record.date
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={
                                                        record.status ===
                                                        "present"
                                                            ? "rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400"
                                                            : "rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-400"
                                                    }
                                                >
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}