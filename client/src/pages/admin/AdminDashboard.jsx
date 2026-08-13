import { useEffect, useState } from "react";
import api from "../../services/api";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, teachersRes, coursesRes] =
                    await Promise.all([
                        api.get("/students"),
                        api.get("/teachers"),
                        api.get("/courses"),
                    ]);

                setStudents(studentsRes.data.students);
                setTeachers(teachersRes.data.teachers);
                setCourses(coursesRes.data.courses);
            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };

        fetchData();
    }, []);

       return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold">
                Admin Dashboard
            </h1>

            <p className="mt-1 text-neutral-400">
                Manage your academic system.
            </p>
        </div>

        <BentoGrid className="mx-auto md:auto-rows-[12rem]">
            <BentoGridItem
                title="Total Students"
                description="Students registered in the system."
                className="md:col-span-1"
                header={
                    <div className="flex h-full min-h-32 items-end">
                        <span className="text-6xl font-bold text-black">
                            {students.length}
                        </span>
                    </div>
                }
            />

            <BentoGridItem
                title="Total Teachers"
                description="Teachers currently registered."
                className="md:col-span-1"
                header={
                    <div className="flex h-full min-h-32 items-end">
                        <span className="text-6xl font-bold text-black">
                            {teachers.length}
                        </span>
                    </div>
                }
            />

            <BentoGridItem
                title="Total Courses"
                description="Courses available in the system."
                className="md:col-span-1"
                header={
                    <div className="flex h-full min-h-32 items-end">
                        <span className="text-6xl font-bold text-black">
                            {courses.length}
                        </span>
                    </div>
                }
            />
        </BentoGrid>
    </div>
);
}