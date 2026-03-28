"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Eye, EyeOff, ArrowRight, Loader2, Shield, Zap, Globe } from "lucide-react";

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
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* 左侧品牌区域 */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#111] via-[#0A0A0A] to-[#080808] p-12 lg:flex xl:p-16">
        {/* 背景装饰 */}
        <div className="pointer-events-none absolute inset-0">
          {/* 网格背景 */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* 渐变光晕 */}
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-white/[0.015] blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm">
            <Cpu size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-white">KXTJ</h2>
            <p className="text-xs tracking-wider text-white/30">HEAVY MACHINERY</p>
          </div>
        </div>

        {/* 中间品牌信息 */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl font-light leading-tight tracking-wide text-white xl:text-5xl">
            企业管理<br />
            <span className="font-semibold">控制中心</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/40">
            统一管理产品、文章、询盘等核心业务数据，
            助力企业高效运营与全球化拓展。
          </p>

          {/* 功能亮点 */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Shield size={18} className="text-white/60" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-white/50">安全加密</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Zap size={18} className="text-white/60" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-white/50">实时同步</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Globe size={18} className="text-white/60" strokeWidth={1.5} />
              </div>
              <span className="text-sm text-white/50">多语言支持</span>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <p className="relative z-10 text-xs tracking-wider text-white/20">
          © {new Date().getFullYear()} KXTJ 重工机械 · 保留所有权利
        </p>
      </div>

      {/* 右侧登录区域 */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2 lg:px-12 xl:px-20">
        {/* 移动端 Logo */}
        <div className="mb-12 flex flex-col items-center gap-4 lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm">
            <Cpu size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-[0.15em] text-white">KXTJ</h1>
            <p className="mt-1 text-sm tracking-wider text-white/30">管理后台</p>
          </div>
        </div>

        {/* 登录表单卡片 */}
        <div className="w-full max-w-[420px]">
          <div className="mb-10 hidden lg:block">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              欢迎回来
            </h2>
            <p className="mt-3 text-base text-white/40">
              登录以管理您的企业内容与数据
            </p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email 字段 */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-[0.08em] text-white/50">
                  登录邮箱
                </label>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-200 focus-within:border-white/25 focus-within:bg-white/[0.06]">
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kxtj.com"
                    className="w-full bg-transparent px-5 py-4 text-base text-white placeholder:text-white/25 outline-none"
                  />
                </div>
              </div>

              {/* Password 字段 */}
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-[0.08em] text-white/50">
                  登录密码
                </label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-200 focus-within:border-white/25 focus-within:bg-white/[0.06]">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent px-5 py-4 text-base text-white placeholder:text-white/25 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 text-white/30 transition-colors duration-200 hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff size={20} strokeWidth={1.5} />
                    ) : (
                      <Eye size={20} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4.5 text-base font-semibold text-[#111111] transition-all duration-200 hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    正在验证...
                  </>
                ) : (
                  <>
                    登录后台
                    <ArrowRight size={20} strokeWidth={2} />
                  </>
                )}
              </button>

              {errorMessage && (
                <p className="text-center text-sm text-red-400">{errorMessage}</p>
              )}
            </form>
          </div>

          {/* 底部提示 - 仅移动端显示 */}
          <p className="mt-10 text-center text-xs tracking-wider text-white/20 lg:hidden">
            © {new Date().getFullYear()} KXTJ 重工机械
          </p>
        </div>
      </div>
    </div>
  );
}
