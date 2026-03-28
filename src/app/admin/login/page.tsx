"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
      };

      if (!response.ok || !result.ok) {
        setErrorMessage("账号或密码错误，请重试。");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">

      {/* 背景纹理：极其微弱的网格 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-[400px] px-6">

        {/* Logo + 标题区 */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm">
            <Cpu size={22} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-[0.15em] text-white uppercase">
              KXTJ 管理后台
            </h1>
            <p className="mt-1 text-xs tracking-[0.06em] text-white/30">
              内部管理系统
            </p>
          </div>
        </div>

        {/* 表单卡片 */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email 字段 */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-white/40">
                登录邮箱
              </label>
              <div className="border-b border-white/10 transition-colors duration-200 focus-within:border-white/40">
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kxtj.com"
                  className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/20 outline-none"
                />
              </div>
            </div>

            {/* Password 字段 */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold tracking-[0.1em] text-white/40">
                登录密码
              </label>
              <div className="flex items-center border-b border-white/10 transition-colors duration-200 focus-within:border-white/40">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/20 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-white/25 transition-colors duration-200 hover:text-white/50"
                >
                  {showPassword
                    ? <EyeOff size={15} strokeWidth={1.8} />
                    : <Eye size={15} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-3.5 text-sm font-semibold text-[#111111] transition-all duration-200 hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  正在验证...
                </>
              ) : (
                <>
                  登录后台
                  <ArrowRight size={15} strokeWidth={2} />
                </>
              )}
            </button>
            {errorMessage ? (
              <p className="text-xs text-red-400">{errorMessage}</p>
            ) : null}

          </form>
        </div>

        {/* 底部版权声明 */}
        <p className="mt-8 text-center text-[10px] tracking-wider text-white/15">
          © {new Date().getFullYear()} KXTJ 重工机械 · 保留所有权利
        </p>
      </div>
    </div>
  );
}
