"use client";

import { useEffect, useState } from "react";
import { Plus, GripVertical, ChevronRight, ChevronDown, Folder, Image as ImageIcon, Globe, Save, Trash2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import type { CategoryStat } from "@/app/api/admin/categories/route";

// ─── 静态配置 ──────────────────────────────────────────────────
const LOCALES = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "ar", label: "العربية" },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("en");
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((res: { ok: boolean; data: CategoryStat[] }) => {
        if (res.ok) {
          setCategories(res.data);
          if (res.data.length > 0) setSelectedCat(res.data[0].name);
        }
      })
      .catch(() => {});
  }, []);

  // 用于静态演示时，展开折叠一些内容
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const confirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteId(null);
    }, 800);
  };

  const confirmCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      setShowNewModal(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      
      {/* ── 双栏布局 ── */}
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_1.5fr] gap-6">
        
        {/* 左侧：分类树 */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/[0.05] p-4 bg-black/[0.02]">
            <h2 className="text-[13px] font-semibold text-[#111111]">目录结构</h2>
            <button 
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold text-[#111111] bg-white border border-black/[0.06] transition-colors hover:bg-black/[0.02] shadow-sm"
            >
              <Plus size={13} strokeWidth={2} />
              新建顶级分类
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {categories.length === 0 ? (
              <p className="px-2 py-6 text-xs text-[#111111]/40">暂无分类（从产品中自动派生）</p>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCat(cat.name)}
                    className={`group flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition-colors cursor-pointer border ${selectedCat === cat.name ? "bg-black/[0.04] border-black/[0.06]" : "bg-[#FAFAFA] border-black/[0.02] hover:bg-black/[0.03]"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder size={14} className="text-[#111111]/40" />
                      <span className="font-medium text-[#111111]">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full">{cat.published}</span>
                      <span className="text-[11px] text-[#111111]/30">{cat.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 右侧：编辑表单 */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/[0.05] p-6 pb-5">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">大型挖掘机</h2>
              <p className="text-xs text-[#111111]/40 mt-1">分类 ID: cat-1</p>
            </div>
            <button 
              onClick={() => setDeleteId("cat-1")}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-black/[0.06] text-[#111111]/40 transition-colors hover:bg-red-50 hover:text-red-500 hover:border-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
             
             {/* 状态与发布 */}
             <div className="flex items-center justify-between rounded-xl border border-black/[0.04] p-4 bg-[#FAFAFA]">
               <div>
                 <span className="text-[12px] font-semibold tracking-wider text-[#111111] uppercase block">
                   启用状态 (Status)
                 </span>
                 <span className="text-[11px] text-[#111111]/40">控制该分类是否在前台显示</span>
               </div>
               <button
                 type="button"
                 className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                 onClick={() => setIsActive(!isActive)}
               >
                 <span className="sr-only">Use setting</span>
                 <span
                   aria-hidden="true"
                   className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-4' : 'translate-x-0'}`}
                 />
               </button>
             </div>

             {/* 基本信息 - 多语言 */}
             <div>
               <h3 className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase mb-4">
                 多语言名称配置
               </h3>
               <div className="mb-4 flex items-center border-b border-black/[0.04]">
                 {LOCALES.map((loc) => (
                   <button
                     key={loc.id}
                     onClick={() => setActiveTab(loc.id)}
                     className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                       activeTab === loc.id
                         ? "text-[#111111]"
                         : "text-[#111111]/40 hover:text-[#111111]/70"
                     }`}
                   >
                     <Globe size={13} className={activeTab === loc.id ? "text-orange-500" : ""} />
                     {loc.label}
                     {activeTab === loc.id && (
                       <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#111111]" />
                     )}
                   </button>
                 ))}
               </div>
               
               <div className="border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                 <input
                   type="text"
                   defaultValue={activeTab === "en" ? "Large Excavators" : activeTab === "zh" ? "大型挖掘机" : "الحفارات الكبيرة"}
                   placeholder="输入分类名称..."
                   className="w-full bg-transparent py-3 text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none"
                 />
               </div>
             </div>

             {/* Slug */}
             <div>
               <h3 className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase mb-3">
                 URL Slug标识
               </h3>
               <div className="border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
                 <input
                   type="text"
                   defaultValue="large-excavators"
                   className="w-full bg-transparent py-3 text-sm text-[#111111] placeholder:text-[#111111]/30 outline-none"
                 />
               </div>
             </div>

             {/* 分类图标 */}
             <div>
               <h3 className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase mb-3">
                 分类图标 (Icon)
               </h3>
               <div className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#FAFAFA] transition-colors hover:border-black/30 hover:bg-black/[0.02]">
                  <ImageIcon size={18} className="text-[#111111]/30" />
                  <span className="text-[10px] text-[#111111]/40">上传图标</span>
               </div>
               <p className="mt-2 text-[11px] text-[#111111]/30">建议尺寸: 128x128px，PNG或SVG格式，透明背景</p>
             </div>

          </div>

          <div className="border-t border-black/[0.05] p-4 bg-black/[0.01]">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-black/80">
              <Save size={16} />
              保存分类设置
            </button>
          </div>
        </section>

      </div>

      {/* 删除确认弹窗 */}
      <AdminModal
        isOpen={!!deleteId}
        onClose={() => !isDeleting && setDeleteId(null)}
        onConfirm={confirmDelete}
        title="确认删除该分类吗？"
        description="此操作将删除该分类及其底部的所有子分类，但这不会删除由于分类绑定的产品（产品将变为未分类状态）。此操作不可恢复。"
        confirmLabel="确认删除"
        loading={isDeleting}
        isDestructive
      />

      {/* 新建分类弹窗 */}
      <AdminModal
        isOpen={showNewModal}
        onClose={() => !isCreating && setShowNewModal(false)}
        onConfirm={confirmCreate}
        title="新建顶级分类"
        confirmLabel="创建分类"
        loading={isCreating}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
              分类名称 (英文 EN)
            </label>
            <div className="border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
              <input
                type="text"
                placeholder="例如: Heavy Equipment"
                className="w-full bg-transparent py-2.5 text-[15px] font-medium text-[#111111] placeholder:text-[#111111]/30 placeholder:font-normal outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold tracking-[0.1em] text-[#111111]/40 uppercase">
              分类名称 (中文 ZH)
            </label>
            <div className="border-b border-black/10 transition-colors duration-200 focus-within:border-black/30">
              <input
                type="text"
                placeholder="例如: 重型设备"
                className="w-full bg-transparent py-2.5 text-[15px] font-medium text-[#111111] placeholder:text-[#111111]/30 placeholder:font-normal outline-none"
              />
            </div>
            <p className="mt-1 text-xs text-[#111111]/40">创建后可以在右侧面板完善其他语言的翻译与配置。</p>
          </div>
        </div>
      </AdminModal>

    </div>
  );
}
