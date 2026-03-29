import ArticleEditorForm from "@/components/admin/ArticleEditorForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArticleEditorForm mode="edit" articleId={id} />;
}
