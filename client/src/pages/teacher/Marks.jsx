import { useEffect, useState } from "react";
import api from "../../services/api";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import { FileText, Loader2 } from "lucide-react";

export default function Marks() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);

    const [courseId, setCourseId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [examType, setExamType] = useState("midterm");
    const [marks, setMarks] = useState("");

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
                    "Failed to fetch teacher marks data:",
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

        if (!courseId || !studentId || !examType || marks === "") {
            alert("Please fill all fields.");
            return;
        }

        if (Number(marks) < 0 || Number(marks) > 100) {
            alert("Marks must be between 0 and 100.");
            return;
        }

        try {
            setSubmitting(true);

            await api.post("/marks", {
                studentId,
                courseId,
                examType,
                marks: Number(marks),
            });

            alert("Marks added successfully.");

            setStudentId("");
            setExamType("midterm");
            setMarks("");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to add marks"
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                        <FileText className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Marks
                        </h1>

                        <p className="mt-1 text-neutral-400">
                            Add marks for your students.
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
                            Add Marks
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
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-blue-400/50"
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
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none disabled:opacity-50 focus:border-blue-400/50"
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

                            {/* Exam Type */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Exam Type
                                </label>

                                <select
                                    value={examType}
                                    onChange={(e) =>
                                        setExamType(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-blue-400/50"
                                >
                                    <option value="midterm">
                                        Midterm
                                    </option>

                                    <option value="assignment">
                                        Assignment
                                    </option>

                                    <option value="final">
                                        Final
                                    </option>
                                </select>
                            </div>

                            {/* Marks */}
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Marks
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={marks}
                                    onChange={(e) =>
                                        setMarks(e.target.value)
                                    }
                                    placeholder="Enter marks"
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-white outline-none focus:border-blue-400/50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {submitting
                                ? "Saving..."
                                : "Save Marks"}
                        </button>
                    </form>
                )}

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
                                                key={enrollment._id}
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