"use client";

import { useParams } from "next/navigation";
import AdminNewProductPage from "../../new/page"; // 复用你设计好的高级布局

export default function EditProductPage() {
  const params = useParams<{ id: string | string[] }>();
  const rawId = params?.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!productId) {
    return (
      <div className="rounded-xl border border-black/[0.06] bg-white p-8 text-sm text-[#111111]/60">
        无效产品 ID。
      </div>
    );
  }

  // 传递 productId 给复用的组件，让它知道是编辑模式
  return <AdminNewProductPage productId={productId} />;
}
