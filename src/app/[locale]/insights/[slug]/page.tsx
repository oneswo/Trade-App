'use client';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import type { ArticleRecord } from '@/lib/data/repository';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function InsightDetailPage({ params }: Props) {
  const locale = useLocale();
  const isZh = locale === 'zh';
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    params.then(({ slug }) => {
      fetch(`/api/articles/${slug}`)
        .then((r) => {
          if (r.status === 404) { setNotFound(true); return null; }
          return r.json() as Promise<{ ok: boolean; data: ArticleRecord }>;
        })
        .then((res) => {
          if (res?.ok) setArticle(res.data);
        })
        .catch(() => setNotFound(true))
        .finally(() => setLoading(false));
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [params]);

  const title = isZh ? (article?.titleZh ?? article?.title) : article?.title;
  const content = isZh ? (article?.contentZh ?? article?.content) : article?.content;
  const summary = isZh ? (article?.summaryZh ?? article?.summary) : article?.summary;

  if (loading) {
    return (
      <main className="w-full bg-[#FAFAFA] pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-[#111111]/40 text-sm">Loading...</p>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="w-full bg-[#FAFAFA] pt-[72px] min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-[#111111]/40 text-lg font-bold">{isZh ? '文章不存在' : 'Article Not Found'}</p>
        <Link href="/insights" className="flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-[#D4AF37] transition-colors">
          <ArrowLeft size={16} /> {isZh ? '返回行业智库' : 'Back to Insights'}
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FAFAFA] pt-[72px]">
      {/* Hero 封面 */}
      {article.coverImageUrl && (
        <div className="relative w-full h-[420px] bg-[#111111] overflow-hidden">
          <Image src={article.coverImageUrl} alt={title ?? ''} fill unoptimized priority className="object-cover opacity-70" onError={(e) => { e.currentTarget.src = '/images/insights/1.jpg'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-[800px] mx-auto px-8 pb-12">
            <div className="inline-block bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#111111] mb-4">
              {article.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{title}</h1>
          </div>
        </div>
      )}

      {/* 文章主体 */}
      <article className="max-w-[800px] mx-auto px-8 py-16">
        {/* 无封面时的标题 */}
        {!article.coverImageUrl && (
          <div className="mb-12">
            <div className="inline-block bg-[#111111] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              {article.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#111111] leading-tight">{title}</h1>
          </div>
        )}

        {/* Meta 信息 */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-8 pb-8 border-b border-gray-100">
          {article.publishedAt && (
            <span>{new Date(article.publishedAt).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          )}
          {article.readTime && (
            <>
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
              <span className="flex items-center gap-1.5"><Clock size={12} />{article.readTime}</span>
            </>
          )}
        </div>

        {/* 摘要 */}
        {summary && (
          <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10 italic border-l-4 border-[#D4AF37] pl-6">
            {summary}
          </p>
        )}

        {/* 正文 */}
        <div className="prose prose-lg max-w-none text-[#111111]/80 leading-relaxed">
          {content?.split('\n').map((para, i) =>
            para.trim() ? <p key={i} className="mb-4">{para}</p> : null
          )}
        </div>

        {/* 返回链接 */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-[#D4AF37] transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {isZh ? '返回行业智库' : 'Back to Insights'}
          </Link>
        </div>
      </article>
    </main>
  );
}
