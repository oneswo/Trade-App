"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Folder, Save, Trash2, Loader2, ImageIcon, GripVertical, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import type { CategoryRecord } from "@/lib/data/repository";

// ─── 语言 Tab ────────────────────────────────────────────────────────────────

const LANG_TABS = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
] as const;
type LangKey = "zh" | "en";

// ─── 图��上传组件 ──────────────────────────────────────────────────────────────

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { directUpload } = await import("@/lib/upload");
      const result = await directUpload(file, "image");
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {value ? (
        <div className="relative group aspect-[4/3] overflow-hidden rounded-xl border border-black/[0.08] bg-[#F6F6F6]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="分类图片" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[11px] font-medium rounded-lg hover:bg-gray-100">更换</button>
            <button type="button" onClick={() => onChange("")}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg hover:bg-red-600">删除</button>
          </div>
        </div>
      ) : (
        <div onClick={() => !uploading && inputRef.current?.click()}
          className={`flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${uploading ? "border-blue-300 bg-blue-50" : "border-black/[0.1] bg-[#FAFAFA] hover:border-black/20"}`}>
          {uploading ? (
            <><Loader2 size={20} className="text-blue-500 animate-spin" /><span className="text-[11px] text-blue-500">上传中...</span></>
          ) : (
            <><ImageIcon size={20} className="text-[#111111]/25" /><span className="text-[11px] text-[#111111]/40">点击上传</span><span className="text-[10px] text-[#111111]/25">建议 4:3，JPG / PNG</span></>
          )}
        </div>
      )}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

// ─── 翻译按钮组件 ────────────────────────────────────────────────────────────

function TranslateButton({
  sourceText,
  onTranslated,
}: {
  sourceText: string;
  onTranslated: (text: string) => void;
}) {
  const [translating, setTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, sourceLang: "zh", targetLang: "en" }),
      });
      const data = await res.json();
      if (data.ok && data.translatedText) {
        onTranslated(data.translatedText);
      }
    } catch (err) {
      console.error("Translation failed:", err);
    } finally {
      setTranslating(false);
    }
  };

  if (!sourceText.trim()) return null;

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={translating}
      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {translating ? (
        <><Loader2 size={11} className="animate-spin" /><span>翻译中</span></>
      ) : (
        <><Sparkles size={11} /><span>AI翻译</span></>
      )}
    </button>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lang, setLang] = useState<LangKey>("zh");

  // 编辑表单状态
  const [form, setForm] = useState<{
    slug: string; nameZh: string; nameEn: string; imageUrl: string;
  }>({ slug: "", nameZh: "", nameEn: "", imageUrl: "" });

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"ok" | "err" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 新建分类弹窗
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ nameZh: "", nameEn: "" });
  const [creating, setCreating] = useState(false);

  // ── 加载列表 ──────────────────────────────────────────────────
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.ok) {
        setCategories(json.data);
        if (!selectedId && json.data.length > 0) {
          selectCategory(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []); // eslint-disable-line

  const selectCategory = (cat: CategoryRecord) => {
    setSelectedId(cat.id);
    setForm({ slug: cat.slug, nameZh: cat.nameZh, nameEn: cat.nameEn, imageUrl: cat.imageUrl ?? "" });
    setSaveResult(null);
  };

  // ── 保存 ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          slug: form.slug,
          nameZh: form.nameZh,
          nameEn: form.nameEn,
          imageUrl: form.imageUrl || null,
          enabled: true,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setSaveResult("ok");
        setCategories((prev) => prev.map((c) => c.id === selectedId ? { ...c, ...json.data } : c));
      } else {
        setSaveResult("err");
      }
    } catch {
      setSaveResult("err");
    } finally {
      setSaving(false);
    }
  };

  // ── 删除 ──────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        const remaining = categories.filter((c) => c.id !== deleteId);
        setCategories(remaining);
        setDeleteId(null);
        if (selectedId === deleteId) {
          if (remaining.length > 0) selectCategory(remaining[0]);
          else { setSelectedId(null); setForm({ slug: "", nameZh: "", nameEn: "", imageUrl: "" }); }
        }
      }
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ── 新建 ──────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newForm.nameEn) return;
    setCreating(true);
    try {
      const slug = newForm.nameEn.trim().replace(/\s+/g, "-").toLowerCase();
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          nameZh: newForm.nameZh || newForm.nameEn,
          nameEn: newForm.nameEn
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setCategories((prev) => [...prev, json.data]);
        selectCategory(json.data);
        setShowNew(false);
        setNewForm({ nameZh: "", nameEn: "" });
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setCreating(false);
    }
  };

  const selected = categories.find((c) => c.id === selectedId);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_1.6fr] gap-6">

        {/* ── 左侧：分类列表 ── */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/[0.05] p-4 bg-black/[0.02]">
            <h2 className="text-[13px] font-semibold text-[#111111]">分类列表</h2>
            <button onClick={() => { setNewForm({ nameZh: "", nameEn: "" }); setShowNew(true); }}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold text-[#111111] bg-white border border-black/[0.06] hover:bg-black/[0.02] shadow-sm">
              <Plus size={13} strokeWidth={2} />新建分类
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 size={18} className="text-[#111111]/30 animate-spin" /></div>
            ) : categories.length === 0 ? (
              <p className="px-2 py-6 text-xs text-[#111111]/40 text-center">暂无分类，点击新建</p>
            ) : (
              <div className="space-y-1">
                {categories.map((cat) => (
                  <div key={cat.id} onClick={() => selectCategory(cat)}
                    className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer border transition-colors ${selectedId === cat.id ? "bg-black/[0.04] border-black/[0.06]" : "bg-[#FAFAFA] border-black/[0.02] hover:bg-black/[0.03]"}`}>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable @next/next/no-img-element */}
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt="" className="w-7 h-7 rounded-md object-cover" />
                      ) : (
                        <Folder size={14} className="text-[#111111]/30" />
                      )}
                      <div>
                        <p className="text-[13px] font-medium text-[#111111]">{cat.nameZh}</p>
                        <p className="text-[11px] text-[#111111]/35">{cat.nameEn}</p>
                      </div>
                    </div>
                    <GripVertical size={14} className="text-[#111111]/20 opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 右侧：编辑面板 ── */}
        <section className="flex flex-col rounded-xl border border-black/[0.06] bg-white shadow-sm overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-[13px] text-[#111111]/30">
              从左侧选择一个分类开始编辑
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-black/[0.05] px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-[#111111]">{selected.nameZh} / {selected.nameEn}</h2>
                  <p className="text-[11px] text-[#111111]/35 mt-0.5">标识符：{selected.slug}</p>
                </div>
                <button onClick={() => setDeleteId(selected.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-black/[0.06] text-[#111111]/40 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* 分类图片 */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold tracking-widest text-[#111111]/40 uppercase">分类图片</label>
                  <p className="text-[11px] text-[#111111]/30">用于首页品类画廊卡片展示</p>
                  <ImageUpload value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} />
                </div>

                {/* 多语言名称 */}
                <div className="space-y-3">
                  <label className="text-[12px] font-semibold tracking-widest text-[#111111]/40 uppercase">显示名称</label>
                  <div className="flex border-b border-black/[0.05]">
                    {LANG_TABS.map((tab) => (
                      <button key={tab.key} onClick={() => setLang(tab.key)}
                        className={`relative px-4 py-2 text-[13px] font-medium transition-colors ${lang === tab.key ? "text-[#111111]" : "text-[#111111]/40 hover:text-[#111111]/70"}`}>
                        {tab.label}
                        {lang === tab.key && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#111111]" />}
                      </button>
                    ))}
                  </div>
                  {lang === "zh" ? (
                    <input value={form.nameZh} onChange={(e) => setForm((f) => ({ ...f, nameZh: e.target.value }))}
                      placeholder="中文显示名称，如：挖掘机"
                      className="w-full border-b border-black/10 bg-transparent py-3 text-[15px] text-[#111111] placeholder:text-[#111111]/25 outline-none focus:border-black/30" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <input value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                        placeholder="English name, e.g.: Excavators"
                        className="flex-1 border-b border-black/10 bg-transparent py-3 text-[15px] text-[#111111] placeholder:text-[#111111]/25 outline-none focus:border-black/30" />
                      <TranslateButton
                        sourceText={form.nameZh}
                        onTranslated={(text) => setForm((f) => ({ ...f, nameEn: text }))}
                      />
                    </div>
                  )}
                </div>

                {/* 筛选标识符 */}
                <div className="space-y-2">
                  <label className="text-[12px] font-semibold tracking-widest text-[#111111]/40 uppercase">筛选标识符</label>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-[12px] text-amber-700 font-medium leading-relaxed">
                      用于产品分类归属和前台筛选，请填写英文。修改后需同步更新已有产��的分类。
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="如：Excavators"
                      className="flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2.5 text-[15px] text-[#111111] outline-none focus:border-black/30" />
                    <TranslateButton
                      sourceText={form.nameZh}
                      onTranslated={(text) => {
                        const slug = text.trim().replace(/\s+/g, "-");
                        setForm((f) => ({ ...f, slug }));
                      }}
                    />
                  </div>
                </div>

              </div>

              <div className="border-t border-black/[0.05] p-4 bg-black/[0.01] flex items-center gap-3">
                <button onClick={handleSave} disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] py-3 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50 transition-all">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  保存分类设置
                </button>
                {saveResult === "ok" && <CheckCircle size={18} className="text-green-500 shrink-0" />}
                {saveResult === "err" && <AlertCircle size={18} className="text-red-500 shrink-0" />}
              </div>
            </>
          )}
        </section>
      </div>

      {/* 删除确认弹窗 */}
      <AdminModal
        isOpen={!!deleteId} onClose={() => !deleting && setDeleteId(null)}
        onConfirm={handleDelete} title="确认删除该分类？"
        description="删除分类不会删除该分类下的产品，产品将变为无分类状态。此操作不可恢复。"
        confirmLabel="确认删除" loading={deleting} isDestructive
      />

      {/* 新建分类弹窗 */}
      <AdminModal
        isOpen={showNew} onClose={() => !creating && setShowNew(false)}
        onConfirm={handleCreate} title="新建分类" confirmLabel="创建分类" loading={creating}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">中文名称 (可选)</label>
            <div className="border-b border-black/10 focus-within:border-black/30">
              <input value={newForm.nameZh} onChange={(e) => setNewForm((f) => ({ ...f, nameZh: e.target.value }))}
                placeholder="例如：挖掘机"
                className="w-full bg-transparent py-2.5 text-[15px] text-[#111111] placeholder:text-[#111111]/30 outline-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold tracking-widest text-[#111111]/40 uppercase">English Name (必填)</label>
            <div className="border-b border-black/10 focus-within:border-black/30">
              <input value={newForm.nameEn} onChange={(e) => setNewForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="e.g.: Excavators"
                className="w-full bg-transparent py-2.5 text-[15px] text-[#111111] placeholder:text-[#111111]/30 outline-none" />
            </div>
            <p className="text-[11px] text-[#111111]/35">英文名会自动生成筛选标识符，创建后可修改</p>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
