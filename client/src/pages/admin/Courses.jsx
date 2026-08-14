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

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteCourseId, setDeleteCourseId] = useState(null);

    const [form, setForm] = useState({
        courseCode: "",
        courseName: "",
        department: "",
        semester: "",
        teacherId: "",
        credits: "",
    });

    const fetchData = async () => {
        try {
            const [coursesRes, teachersRes] = await Promise.all([
                api.get("/courses"),
                api.get("/teachers"),
            ]);

            setCourses(coursesRes.data.courses);
            setTeachers(teachersRes.data.teachers);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
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
            courseCode: "",
            courseName: "",
            department: "",
            semester: "",
            teacherId: "",
            credits: "",
        });

        setEditingCourse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/courses", {
                ...form,
                semester: Number(form.semester),
                credits: Number(form.credits),
            });

            resetForm();
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create course"
            );
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/courses/${editingCourse._id}`, {
                courseCode: form.courseCode,
                courseName: form.courseName,
                department: form.department,
                semester: Number(form.semester),
                teacherId: form.teacherId,
                credits: Number(form.credits),
            });

            resetForm();
            setShowForm(false);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update course"
            );
        }
    };

    const handleEditClick = (course) => {
        setEditingCourse(course);

        setForm({
            courseCode: course.courseCode || "",
            courseName: course.courseName || "",
            department: course.department || "",
            semester: course.semester || "",
            teacherId: course.teacherId?._id || "",
            credits: course.credits || "",
        });

        setShowForm(true);
    };

    const filteredCourses = courses.filter((course) => {
        const code = course.courseCode?.toLowerCase() || "";
        const name = course.courseName?.toLowerCase() || "";
        const department = course.department?.toLowerCase() || "";

        const query = search.toLowerCase();

        return (
            code.includes(query) ||
            name.includes(query) ||
            department.includes(query)
        );
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Courses
                    </h1>

                    <p className="mt-1 text-neutral-400">
                        Manage courses and assigned teachers.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
                >
                    + Add Course
                </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
                />

                <p className="text-sm text-neutral-500">
                    {courses.length} courses
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
                            {editingCourse
                                ? "Edit Course"
                                : "Add New Course"}
                        </DialogTitle>

                        <DialogDescription className="text-neutral-400">
                            {editingCourse
                                ? "Update course information."
                                : "Create a new course and assign a teacher."}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={
                            editingCourse
                                ? handleEdit
                                : handleSubmit
                        }
                    >
                        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Course Code
                                </label>

                                <input
                                    name="courseCode"
                                    value={form.courseCode}
                                    onChange={handleChange}
                                    required
                                    placeholder="CS201"
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Course Name
                                </label>

                                <input
                                    name="courseName"
                                    value={form.courseName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Data Structures"
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Department
                                </label>

                                <input
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                    placeholder="Computer Science & Engineering"
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Semester
                                </label>

                                <input
                                    name="semester"
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={form.semester}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Teacher
                                </label>

                                <select
                                    name="teacherId"
                                    value={form.teacherId}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/40"
                                >
                                    <option value="">
                                        Select Teacher
                                    </option>

                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher._id}
                                            value={teacher._id}
                                        >
                                            {teacher.userId?.name} —{" "}
                                            {teacher.subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-neutral-400">
                                    Credits
                                </label>

                                <input
                                    name="credits"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={form.credits}
                                    onChange={handleChange}
                                    required
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
                                {editingCourse
                                    ? "Save Changes"
                                    : "Create Course"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deleteCourseId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteCourseId(null);
                    }
                }}
            >
                <AlertDialogContent className="border-white/10 bg-neutral-950 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete course?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-neutral-400">
                            This will permanently delete this course.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/10">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={async () => {
                                if (!deleteCourseId) return;

                                try {
                                    await api.delete(
                                        `/courses/${deleteCourseId}`
                                    );

                                    setDeleteCourseId(null);
                                    fetchData();
                                } catch (error) {
                                    alert(
                                        error.response?.data?.message ||
                                        "Failed to delete course"
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
                                    Course
                                </th>

                                <th className="px-6 py-4">
                                    Department
                                </th>

                                <th className="px-6 py-4">
                                    Semester
                                </th>

                                <th className="px-6 py-4">
                                    Teacher
                                </th>

                                <th className="px-6 py-4">
                                    Credits
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
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        Loading courses...
                                    </td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className="border-b border-white/5 hover:bg-white/[0.03]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium">
                                                {course.courseName}
                                            </div>

                                            <div className="text-sm text-neutral-500">
                                                {course.courseCode}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {course.department}
                                        </td>

                                        <td className="px-6 py-4">
                                            {course.semester}
                                        </td>

                                        <td className="px-6 py-4">
                                            {course.teacherId?.userId?.name ||
                                                "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            {course.credits}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            course
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteCourseId(
                                                            course._id
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}