import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import api from "../../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            const role = response.data.user.role;

            if (role === "admin") navigate("/admin");
            else if (role === "teacher") navigate("/teacher");
            else navigate("/student");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl md:grid-cols-2">

                {/* Left side */}
                <div className="hidden flex-col justify-between p-12 md:flex">
                    <div>
                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold">
                                SIS
                            </div>

                            <span className="text-lg font-semibold text-white">
                                Student Information System
                            </span>
                        </div>

                        <h1 className="max-w-lg text-5xl font-bold leading-tight text-white">
                            Manage your academic life
                            <span className="text-neutral-400">
                                {" "}in one place.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-neutral-400">
                            Access students, teachers, courses,
                            attendance and academic results through
                            one centralized platform.
                        </p>
                    </div>

                    <p className="text-sm text-neutral-500">
                        Secure academic management platform
                    </p>
                </div>

                {/* Login */}
                <div className="border-white/10 bg-white p-8 md:border-l md:p-12">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-neutral-500">
                            Sign in to your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-neutral-700">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-black px-4 py-3.5 font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-neutral-400">
                        Student Information System © 2026
                    </p>
                </div>
            </div>
        </div>
    );
}