import { redirect } from "next/navigation";

/**
 * /admin → /admin/login
 * 静态 UI 阶段直接跳转，后期加入 JWT 鉴权后在此处判断
 */
export default function AdminIndexPage() {
  redirect("/admin/login");
}
