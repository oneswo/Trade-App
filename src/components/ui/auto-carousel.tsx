"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Category {
  name: string;
  type: string;
  img: string;
}

export default function AutoCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 监听滚动位置来同步更新底部的“圆点进度条”
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
       const cardWidth = el.clientWidth > 768 ? 350 : 280;
       const index = Math.round(el.scrollLeft / (cardWidth + 32)); // 32 为卡片之间的间距 gap-8
       setActiveIndex(Math.max(0, Math.min(index, categories.length - 1)));
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [categories.length]);

  // 顺滑步进式轮播
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isHovered) return;

    const scrollInterval = setInterval(() => {
      // 检查是否滚动到了最右侧（留足误差阈值）
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 50) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // 当存在 CSS snap-mandatory 时，单次步进滑动（约一张卡片的宽度），浏览器会自动完美吸附捕捉
        el.scrollBy({ left: 350, behavior: 'smooth' });
      }
    }, 3500); // 更改为每 3.5 秒平滑翻页一次，彻底消除高频抖动

    return () => clearInterval(scrollInterval);
  }, [isHovered]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden group/carousel border-t border-b border-gray-100 py-16">
       
       <div 
         ref={scrollRef}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
         className="w-full pl-8 md:pl-[calc((100vw-1440px)/2+2rem)] pr-8 pb-4 flex gap-8 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
       >
         {categories.map((cat, i) => (
           <div key={i} className="shrink-0 w-[280px] md:w-[350px] snap-center cursor-pointer flex flex-col items-center group/card">
              <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-6 shadow-sm group-hover/card:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 border border-gray-100">
                <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out" priority={i < 2} />
                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300 shadow-md">
                   <ArrowRight size={16} className="text-[#111111]" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-[#111111] group-hover/card:text-[#D4AF37] transition-colors">{cat.name}</h3>
              </div>
           </div>
         ))}
       </div>

       {/* 将原本右上角的按钮下沉到底部，并加上圆点指示器（点阵排版） */}
       <div className="flex items-center justify-center gap-8 mt-12 z-20">
         <button onClick={() => scrollByAmount(-350)} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-x-1">
            <ArrowLeft size={18}/>
         </button>
         
         {/* 经典的分页圆点设计，使用动态宽度制造丝滑感 */}
         <div className="flex items-center gap-2">
            {categories.map((_, idx) => (
                <div 
                   key={idx} 
                   className={`h-2 rounded-full transition-all duration-500 ease-in-out ${activeIndex === idx ? 'w-8 bg-[#111111]' : 'w-2 bg-gray-300'}`}
                />
            ))}
         </div>

         <button onClick={() => scrollByAmount(350)} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-[#111111] bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-lg hover:translate-x-1">
            <ArrowRight size={18}/>
         </button>
       </div>

    </div>
  );
}
