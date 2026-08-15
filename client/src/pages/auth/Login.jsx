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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#05070b] via-[#0a0e14] to-[#05070b] px-6">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#fbbf24"
            />

            <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-[0_0_80px_-20px_rgba(251,191,36,0.15)] backdrop-blur-xl md:grid-cols-2">

                {/* Left side */}
                <div className="hidden flex-col justify-between p-12 md:flex">
                    <div>
                        <div className="mb-10 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-400/25 to-transparent font-serif font-semibold text-amber-300">
                                SIS
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Student Information System
                            </span>
                        </div>

                        <h1 className="max-w-lg font-serif text-5xl font-medium leading-tight text-white">
                            Manage your academic life
                            <span className="text-amber-300">
                                {" "}in one place.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-slate-400">
                            Access students, teachers, courses,
                            attendance and academic results through
                            one centralized platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-amber-400/40" />
                        <p className="text-sm text-slate-500">
                            Secure academic management platform
                        </p>
                    </div>
                </div>

                {/* Login */}
                <div className="border-white/[0.08] bg-white/[0.02] p-8 md:border-l md:p-12">
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl font-medium text-white">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Sign in to your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-slate-400">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-white placeholder-slate-600 outline-none transition focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-4 py-3.5 font-medium text-black transition hover:from-amber-300 hover:to-amber-200 active:scale-[0.98]"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-600">
                        Student Information System © 2026
                    </p>
                </div>
            </div>
        </div>
    );
}