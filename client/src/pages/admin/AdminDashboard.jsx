import { useEffect, useState } from "react";
import api from "../../services/api";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Users, GraduationCap, BookOpen } from "lucide-react";

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

    const stats = [
        {
            title: "Total Students",
            description: "Students registered in the system.",
            value: students.length,
            icon: Users,
            gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
            iconColor: "text-violet-400",
        },
        {
            title: "Total Teachers",
            description: "Teachers currently registered.",
            value: teachers.length,
            icon: GraduationCap,
            gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
            iconColor: "text-sky-400",
        },
        {
            title: "Total Courses",
            description: "Courses available in the system.",
            value: courses.length,
            icon: BookOpen,
            gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
            iconColor: "text-emerald-400",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-neutral-400">
                    Manage your academic system.
                </p>
            </div>

            <BentoGrid className="mx-auto md:auto-rows-[10rem]">
                {stats.map((stat) => (
                    <BentoGridItem
                        key={stat.title}
                        title={
                            <span className="text-white">{stat.title}</span>
                        }
                        description={
                            <span className="text-neutral-400">
                                {stat.description}
                            </span>
                        }
                        className={`md:col-span-1 border border-white/10 bg-neutral-900 bg-gradient-to-br ${stat.gradient} transition-transform duration-300 hover:-translate-y-1 hover:border-white/20`}
                        header={
                            <div className="flex h-full min-h-32 items-end justify-between">
                                <span className="text-5xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </span>
                                <stat.icon
                                    className={`h-9 w-9 ${stat.iconColor}`}
                                    strokeWidth={1.75}
                                />
                            </div>
                        }
                    />
                ))}
            </BentoGrid>
        </div>
    );
}