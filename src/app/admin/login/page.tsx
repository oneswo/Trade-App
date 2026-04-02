"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const result = (await response.json()) as { ok: boolean };

      if (!response.ok || !result.ok) {
        setErrorMessage("安全密钥验证失败，请重新核对。");
        return;
      }

      const next = searchParams.get("next") ?? "/admin/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setErrorMessage("网络异常，无法连接控制服务器。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2.5">
        <label className="text-[11px] font-bold tracking-widest text-[#D4AF37]/80 uppercase">
          管理员身份 ID
        </label>
        <input
          type="text"
          required
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="请输入管理员用户名"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-[14px] font-bold text-white placeholder:text-white/20 placeholder:font-medium outline-none transition-all hover:bg-white/[0.04] focus:border-[#D4AF37]/50 focus:bg-[#000000] focus:ring-4 focus:ring-[#D4AF37]/10"
        />
      </div>

      <div className="space-y-2.5">
        <label className="text-[11px] font-bold tracking-widest text-[#D4AF37]/80 uppercase">
          高阶安全密钥
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 pr-12 text-[14px] font-bold text-white placeholder:text-white/20 placeholder:font-medium outline-none transition-all hover:bg-white/[0.04] focus:border-[#D4AF37]/50 focus:bg-[#000000] focus:ring-4 focus:ring-[#D4AF37]/10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/35 transition-colors hover:text-[#D4AF37]"
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
           <p className="text-[12px] font-bold text-red-400">
             {errorMessage}
           </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] py-4 text-[14px] font-bold tracking-widest text-[#111111] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none group"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin text-[#111111]" />
            正在登录...
          </>
        ) : (
          <>
            启动系统
            <ArrowRight size={16} className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121316] relative overflow-hidden px-4">
      {/* 极暗奢华工业金光晕（加暖） */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-[#D4AF37]/[0.03] to-transparent pointer-events-none blur-3xl mix-blend-screen"></div>

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Logo 与欢迎文案 */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white/[0.03] backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.1)] border border-white/[0.08] mb-6 relative">
            <Cpu size={28} className="text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            进入控制中心
          </h1>
        </div>

        {/* 玻璃态冷峻黑卡片 */}
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-3xl p-8 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#D4AF37]" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
