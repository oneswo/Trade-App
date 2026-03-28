"use client";

import { useParams } from "next/navigation";
import ProductEditorForm from "@/components/admin/ProductEditorForm";

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

  return <ProductEditorForm mode="edit" productId={productId} />;
}
