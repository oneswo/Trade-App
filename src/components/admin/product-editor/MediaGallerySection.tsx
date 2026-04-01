"use client";

import { Image as ImageIcon, Plus, Trash2, Video } from "lucide-react";

export function MediaGallerySection({
  stockAmount,
  onStockAmountChange,
  videoUrl,
  coverImageUrl,
  galleryImageUrls,
  uploading,
  onUpload,
  onRemoveGalleryImage,
}: {
  stockAmount: number;
  onStockAmountChange: (value: number) => void;
  videoUrl: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  uploading: boolean;
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "gallery" | "video"
  ) => void;
  onRemoveGalleryImage: (index: number) => void;
}) {
  return (
    <section className="bg-white rounded-xl p-8 border border-black/[0.06] shadow-sm flex flex-col h-full">
      <div className="mb-6 pb-4 border-b border-black/[0.05] flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#111111] flex items-center gap-2">
          <ImageIcon size={16} className="text-[#111111]/40" />
          数字视觉馆 (Media Gallery)
        </h2>
        <div className="flex items-center gap-3 bg-[#FAFAFA] border border-black/[0.06] rounded-lg p-1.5 pr-4 shadow-sm">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-black/[0.04] text-[#25D366]">
            <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse shadow-lg" />
          </div>
          <label className="text-[11px] font-semibold tracking-widest text-[#111111]/50 uppercase">
            现车库存
          </label>
          <input
            type="number"
            value={stockAmount}
            onChange={(e) => onStockAmountChange(Number(e.target.value) || 0)}
            min="0"
            className="w-12 bg-transparent text-[14px] font-bold text-[#111111] focus:outline-none text-right placeholder:text-[#111111]/20"
          />
          <span className="text-[11px] font-bold text-[#111111]/40">台</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-between">
        <label className="w-full h-full min-h-[240px] rounded-xl bg-[#FAFAFA] border-2 border-dashed border-black/[0.08] flex flex-col items-center justify-center cursor-pointer hover:border-black/[0.2] hover:bg-white transition-all group overflow-hidden relative">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onUpload(e, "video")}
            disabled={uploading}
          />
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full border border-black/[0.1] bg-white flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-black/[0.2] transition-all shadow-sm">
                <Video
                  size={20}
                  className="text-[#111111]/40 group-hover:text-[#111111] transition-colors"
                />
              </div>
              <span className="text-[13px] font-bold text-[#111111]/60 group-hover:text-[#111111] transition-colors">
                点击上传主视频
              </span>
            </>
          )}
        </label>

        <div className="grid grid-cols-5 gap-3 shrink-0">
          <label className="aspect-[16/10] rounded-lg bg-[#FAFAFA] border border-black/[0.08] border-dashed flex items-center justify-center text-[#111111]/30 hover:text-[#111111] hover:border-black/[0.2] hover:bg-white transition-all cursor-pointer relative overflow-hidden group shadow-sm">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUpload(e, "cover")}
              disabled={uploading}
            />
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <Plus size={20} className="group-hover:scale-110 transition-transform" />
            )}
            <div className="absolute top-0 right-0 bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px]">
              主图
            </div>
          </label>

          {[0, 1, 2, 3].map((i) => (
            <label
              key={i}
              className="aspect-[16/10] rounded-lg bg-[#FAFAFA] border border-black/[0.08] border-dashed flex items-center justify-center text-[#111111]/30 hover:text-[#111111] hover:border-black/[0.2] hover:bg-white transition-all cursor-pointer relative overflow-hidden group shadow-sm"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(e, "gallery")}
                disabled={uploading}
              />
              {galleryImageUrls[i] ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galleryImageUrls[i]}
                    alt="gallery"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveGalleryImage(i);
                    }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <Plus size={20} className="group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute top-0 right-0 bg-black/[0.1] text-black/[0.4] text-[9px] font-bold px-1.5 py-0.5 rounded-bl-[4px]">
                {i + 2}
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
