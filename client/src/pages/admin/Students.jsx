
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
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);
    const [deleteStudentId, setDeleteStudentId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        studentId: "",
        department: "",
        semester: "",
        phone: "",
        dateOfBirth: "",
        address: "",
    });

    const fetchStudents = async () => {
        try {
            const response = await api.get("/students");
            setStudents(response.data.students);
        } catch (error) {
            console.error("Failed to fetch students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/students", {
                ...form,
                semester: Number(form.semester),
            });

            setForm({
                name: "",
                email: "",
                password: "",
                studentId: "",
                department: "",
                semester: "",
                phone: "",
                dateOfBirth: "",
                address: "",
            });

            setShowForm(false);
            fetchStudents();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to create student"
            );
        }
    };
    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/students/${editingStudent._id}`, {
                name: form.name,
                email: form.email,
                department: form.department,
                semester: Number(form.semester),
                phone: form.phone,
                dateOfBirth: form.dateOfBirth,
                address: form.address,
            });

            setEditingStudent(null);
            setShowForm(false);

            setForm({
                name: "",
                email: "",
                password: "",
                studentId: "",
                department: "",
                semester: "",
                phone: "",
                dateOfBirth: "",
                address: "",
            });

            fetchStudents();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to update student"
            );
        }
    };

    const filteredStudents = students.filter((student) => {
        const name = student.userId?.name?.toLowerCase() || "";
        const email = student.userId?.email?.toLowerCase() || "";
        const studentId = student.studentId?.toLowerCase() || "";
        const department = student.department?.toLowerCase() || "";

        const query = search.toLowerCase();

        return (
            name.includes(query) ||
            email.includes(query) ||
            studentId.includes(query) ||
            department.includes(query)
        );
    });
    return (
        <div >
            <div className="mb-4 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white/30"
                />

                <p className="text-sm text-neutral-500">
                    {students.length} students
                </p>
            </div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Students
                    </h1>

                    <p className="mt-1 text-neutral-400">
                        Manage registered students.
                    </p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
                >
                    + Add Student
                </button>
            </div>

            <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogContent className="border-white/10 bg-neutral-950 text-white sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingStudent ? "Edit Student" : "Add New Student"}
                        </DialogTitle>

                        <DialogDescription className="text-neutral-400">
                            {editingStudent
                                ? "Update the student's academic information."
                                : "Create a new student account and academic profile."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={editingStudent ? handleEdit : handleSubmit}>
                        <div className="grid max-h-[65vh] gap-4 overflow-y-auto py-4 md:grid-cols-2">
                            {[
                                ["name", "Full Name"],
                                ["email", "Email"],
                                ["password", "Password"],
                                ["studentId", "Student ID"],
                                ["department", "Department"],
                                ["semester", "Semester"],
                                ["phone", "Phone"],
                                ["dateOfBirth", "Date of Birth"],
                                ["address", "Address"],
                            ].filter(([name]) => {
                                if (editingStudent && name === "password") {
                                    return false;
                                }

                                return true;
                            }).map(([name, label]) => (
                                <div key={name}>
                                    <label className="mb-2 block text-sm text-neutral-400">
                                        {label}
                                    </label>

                                    <input
                                        name={name}
                                        type={
                                            name === "password"
                                                ? "password"
                                                : name === "dateOfBirth"
                                                    ? "date"
                                                    : name === "semester"
                                                        ? "number"
                                                        : "text"
                                        }
                                        value={form[name]}
                                        onChange={handleChange}
                                        required={[
                                            "name",
                                            "email",
                                            "password",
                                            "studentId",
                                            "department",
                                            "semester",
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
                                    setEditingStudent(null);
                                }}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm hover:bg-white/5"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200"
                            >
                                {editingStudent ? "Save Changes" : "Create Student"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog
                open={!!deleteStudentId}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteStudentId(null);
                    }
                }}
            >
                <AlertDialogContent className="border-white/10 bg-neutral-950 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete student?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-neutral-400">
                            This will permanently delete the student and
                            their user account. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="border-white/10 bg-transparent text-white hover:bg-white/10"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={async () => {
                                if (!deleteStudentId) return;

                                try {
                                    await api.delete(
                                        `/students/${deleteStudentId}`
                                    );

                                    setDeleteStudentId(null);
                                    fetchStudents();
                                } catch (error) {
                                    alert(
                                        error.response?.data?.message ||
                                        "Failed to delete student"
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
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Student ID</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Semester</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-neutral-400"
                                    >
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr
                                        key={student._id}
                                        className="border-b border-white/5 hover:bg-white/[0.03]"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium">
                                                {student.userId?.name}
                                            </div>

                                            <div className="text-sm text-neutral-500">
                                                {student.userId?.email}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {student.studentId}
                                        </td>

                                        <td className="px-6 py-4">
                                            {student.department}
                                        </td>

                                        <td className="px-6 py-4">
                                            {student.semester}
                                        </td>

                                        <td className="px-6 py-4">
                                            {student.phone || "-"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingStudent(student);

                                                        setForm({
                                                            name: student.userId?.name || "",
                                                            email: student.userId?.email || "",
                                                            password: "",
                                                            studentId: student.studentId || "",
                                                            department: student.department || "",
                                                            semester: student.semester || "",
                                                            phone: student.phone || "",
                                                            dateOfBirth: student.dateOfBirth
                                                                ? student.dateOfBirth.split("T")[0]
                                                                : "",
                                                            address: student.address || "",
                                                        });

                                                        setShowForm(true);
                                                    }}
                                                    className="rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => setDeleteStudentId(student._id)}
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