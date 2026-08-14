import { useEffect, useState } from "react";
import api from "../../services/api";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Marks() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [marks, setMarks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingMark, setEditingMark] = useState(null);
    const [deleteMarkId, setDeleteMarkId] = useState(null);

    const [form, setForm] = useState({
        studentId: "",
        courseId: "",
        examType: "midterm",
        marks: "",
    });

    const fetchData = async () => {
        try {
            const [studentsRes, coursesRes, marksRes] =
                await Promise.all([
                    api.get("/students"),
                    api.get("/courses"),
                    api.get("/marks"),
                ]);

            setStudents(studentsRes.data.students);
            setCourses(coursesRes.data.courses);
            setMarks(marksRes.data.marks);
        } catch (error) {
            console.error("Failed to fetch marks data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            studentId: "",
            courseId: "",
            examType: "midterm",
            marks: "",
        });

        setEditingMark(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/marks", {
                ...form,
                marks: Number(form.marks),
            });

            resetForm();
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to add marks"
            );
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/marks/${editingMark._id}`, {
                studentId: form.studentId,
                courseId: form.courseId,
                examType: form.examType,
                marks: Number(form.marks),
            });

            resetForm();
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update marks"
            );
        }
    };

    const handleEditClick = (mark) => {
        setEditingMark(mark);

        setForm({
            studentId: mark.studentId || "",
            courseId: mark.courseId?._id || "",
            examType: mark.examType || "midterm",
            marks: mark.marks || "",
        });

        setShowForm(true);
    };

    const filteredMarks = marks.filter((mark) => {
        const student = students.find(
            (item) => item._id === mark.studentId
        );

        const studentName =
            student?.userId?.name?.toLowerCase() || "";

        const studentCode =
            student?.studentId?.toLowerCase() || "";

        const courseCode =
            mark.courseId?.courseCode?.toLowerCase() || "";

        const courseName =
            mark.courseId?.courseName?.toLowerCase() || "";

        const examType =
            mark.examType?.toLowerCase() || "";

        const query = search.toLowerCase();

        return (
            studentName.includes(query) ||
            studentCode.includes(query) ||
            courseCode.includes(query) ||
            courseName.includes(query) ||
            examType.includes(query)
        );
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Marks
                    </h1>

                    <p className="mt-1 text-neutral-400">
                        Manage student examination marks.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
                >
                    + Add Marks
                </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search marks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
                />

                <p className="text-sm text-neutral-500">
                    {marks.length} records
                </p>
            </div>

            <Dialog
                open={showForm}
                onOpenChange={(open) => {
                    setShowForm(open);

                    if (!open) {
                        resetForm();
                    }
                }}
            >
                <DialogContent className="border-white/10 bg-neutral-950 text-white sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingMark
                                ? "Edit Marks"
                                : "Add Marks"}
                        </DialogTitle>

                        <DialogDescription className="text-neutral-400">
                            {editingMark
                                ? "Update the student's examination marks."
                                : "Add examination marks for a student."}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={
                            editingMark
                                ? handleEdit
                                : handleSubmit
                        }
                    >
                        <div className="grid gap-4 py-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Student
                                </label>

                                <select
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
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
                                    name="courseId"
                                    value={form.courseId}
                                    onChange={handleChange}
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
                                    Exam Type
                                </label>

                                <select
                                    name="examType"
                                    value={form.examType}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                >
                                    <option value="midterm">
                                        Midterm
                                    </option>

                                    <option value="final">
                                        Final
                                    </option>

                                    <option value="assignment">
                                        Assignment
                                    </option>

                                    <option value="quiz">
                                        Quiz
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Marks
                                </label>

                                <input
                                    name="marks"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.marks}
                                    onChange={handleChange}
                                    required
                                    placeholder="78"
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200"
                            >
                                {editingMark
                                    ? "Save Changes"
                                    : "Add Marks"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deleteMarkId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteMarkId(null);
                    }
                }}
            >
                <AlertDialogContent className="border-white/10 bg-neutral-950 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete marks?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-neutral-400">
                            This will permanently delete this marks
                            record. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/10">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={async () => {
                                if (!deleteMarkId) return;

                                try {
                                    await api.delete(
                                        `/marks/${deleteMarkId}`
                                    );

                                    setDeleteMarkId(null);
                                    fetchData();
                                } catch (error) {
                                    alert(
                                        error.response?.data?.message ||
                                        "Failed to delete marks"
                                    );
                                }
                            }}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
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
                                    Exam
                                </th>

                                <th className="px-6 py-4">
                                    Marks
                                </th>

                                <th className="px-6 py-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        Loading marks...
                                    </td>
                                </tr>
                            ) : filteredMarks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        No marks records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredMarks.map((mark) => {
                                    const student = students.find(
                                        (item) =>
                                            item._id ===
                                            mark.studentId
                                    );

                                    return (
                                        <tr
                                            key={mark._id}
                                            className="border-b border-white/5 hover:bg-white/[0.03]"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium">
                                                    {student?.userId?.name ||
                                                        "Unknown Student"}
                                                </div>

                                                <div className="text-sm text-neutral-500">
                                                    {student?.studentId ||
                                                        "-"}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {mark.courseId
                                                    ?.courseCode ||
                                                    "-"}
                                                {" — "}
                                                {mark.courseId
                                                    ?.courseName ||
                                                    "-"}
                                            </td>

                                            <td className="px-6 py-4 capitalize">
                                                {mark.examType}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-semibold">
                                                    {mark.marks}
                                                </span>
                                                <span className="text-neutral-500">
                                                    {" "}
                                                    / 100
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                mark
                                                            )
                                                        }
                                                        className="rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            setDeleteMarkId(
                                                                mark._id
                                                            )
                                                        }
                                                        className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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