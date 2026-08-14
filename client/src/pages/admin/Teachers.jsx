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

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [deleteTeacherId, setDeleteTeacherId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        teacherId: "",
        department: "",
        subject: "",
        phone: "",
    });

    const fetchTeachers = async () => {
        try {
            const response = await api.get("/teachers");
            setTeachers(response.data.teachers);
        } catch (error) {
            console.error("Failed to fetch teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            name: "",
            email: "",
            password: "",
            teacherId: "",
            department: "",
            subject: "",
            phone: "",
        });

        setEditingTeacher(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/teachers", form);

            resetForm();
            setShowForm(false);
            fetchTeachers();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create teacher"
            );
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/teachers/${editingTeacher._id}`, {
                name: form.name,
                email: form.email,
                department: form.department,
                subject: form.subject,
                phone: form.phone,
            });

            resetForm();
            setShowForm(false);
            fetchTeachers();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update teacher"
            );
        }
    };

    const handleEditClick = (teacher) => {
        setEditingTeacher(teacher);

        setForm({
            name: teacher.userId?.name || "",
            email: teacher.userId?.email || "",
            password: "",
            teacherId: teacher.teacherId || "",
            department: teacher.department || "",
            subject: teacher.subject || "",
            phone: teacher.phone || "",
        });

        setShowForm(true);
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const name = teacher.userId?.name?.toLowerCase() || "";
        const email = teacher.userId?.email?.toLowerCase() || "";
        const teacherId = teacher.teacherId?.toLowerCase() || "";
        const department = teacher.department?.toLowerCase() || "";
        const subject = teacher.subject?.toLowerCase() || "";

        const query = search.toLowerCase();

        return (
            name.includes(query) ||
            email.includes(query) ||
            teacherId.includes(query) ||
            department.includes(query) ||
            subject.includes(query)
        );
    });

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Teachers
                    </h1>

                    <p className="mt-1 text-neutral-400">
                        Manage registered teachers.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
                >
                    + Add Teacher
                </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search teachers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
                />

                <p className="text-sm text-neutral-500">
                    {teachers.length} teachers
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
                            {editingTeacher
                                ? "Edit Teacher"
                                : "Add New Teacher"}
                        </DialogTitle>

                        <DialogDescription className="text-neutral-400">
                            {editingTeacher
                                ? "Update the teacher's information."
                                : "Create a new teacher account."}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={
                            editingTeacher
                                ? handleEdit
                                : handleSubmit
                        }
                    >
                        <div className="grid max-h-[60vh] gap-4 overflow-y-auto py-4 md:grid-cols-2">
                            {[
                                ["name", "Full Name"],
                                ["email", "Email"],
                                ["password", "Password"],
                                ["teacherId", "Teacher ID"],
                                ["department", "Department"],
                                ["subject", "Subject"],
                                ["phone", "Phone"],
                            ]
                                .filter(([name]) => {
                                    if (
                                        editingTeacher &&
                                        name === "password"
                                    ) {
                                        return false;
                                    }

                                    return true;
                                })
                                .map(([name, label]) => (
                                    <div key={name}>
                                        <label className="mb-2 block text-sm text-neutral-400">
                                            {label}
                                        </label>

                                        <input
                                            name={name}
                                            type={
                                                name === "password"
                                                    ? "password"
                                                    : "text"
                                            }
                                            value={form[name]}
                                            onChange={handleChange}
                                            required={[
                                                "name",
                                                "email",
                                                "password",
                                                "teacherId",
                                                "department",
                                                "subject",
                                            ].includes(name)}
                                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/40"
                                        />
                                    </div>
                                ))}
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
                                {editingTeacher
                                    ? "Save Changes"
                                    : "Create Teacher"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deleteTeacherId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTeacherId(null);
                    }
                }}
            >
                <AlertDialogContent className="border-white/10 bg-neutral-950 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete teacher?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-neutral-400">
                            This will permanently delete the teacher
                            and their user account. This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/10">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={async () => {
                                if (!deleteTeacherId) return;

                                try {
                                    await api.delete(
                                        `/teachers/${deleteTeacherId}`
                                    );

                                    setDeleteTeacherId(null);
                                    fetchTeachers();
                                } catch (error) {
                                    alert(
                                        error.response?.data?.message ||
                                        "Failed to delete teacher"
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
                                    Teacher
                                </th>

                                <th className="px-6 py-4">
                                    Teacher ID
                                </th>

                                <th className="px-6 py-4">
                                    Department
                                </th>

                                <th className="px-6 py-4">
                                    Subject
                                </th>

                                <th className="px-6 py-4">
                                    Phone
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
                                        Loading teachers...
                                    </td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        No teachers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredTeachers.map((teacher) => (
                                    <tr
                                        key={teacher._id}
                                        className="border-b border-white/5 hover:bg-white/[0.03]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium">
                                                {teacher.userId?.name}
                                            </div>

                                            <div className="text-sm text-neutral-500">
                                                {teacher.userId?.email}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {teacher.teacherId}
                                        </td>

                                        <td className="px-6 py-4">
                                            {teacher.department}
                                        </td>

                                        <td className="px-6 py-4">
                                            {teacher.subject}
                                        </td>

                                        <td className="px-6 py-4">
                                            {teacher.phone || "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            teacher
                                                        )
                                                    }
                                                    className="rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteTeacherId(
                                                            teacher._id
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