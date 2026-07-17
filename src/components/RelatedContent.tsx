import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRelatedContent, type RelatedContentContext } from '../relatedContent';

interface RelatedContentProps {
  currentPath: string;
  context: RelatedContentContext;
  excludedPaths?: string[];
}

export function RelatedContent({ currentPath, context, excludedPaths = [] }: RelatedContentProps) {
  const items = getRelatedContent(currentPath, context, excludedPaths);

  if (items.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-white border-r-4 border-[#0055FF] pr-3">روابط مقترحة حسب موضوع الصفحة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link key={item.path} to={item.path} className="bg-[#12141E] border border-white/5 hover:border-[#0055FF]/40 rounded-xl p-5 flex items-center justify-between gap-3 transition-colors">
            <span className="text-xs font-bold text-white">{item.title}</span>
            <ArrowLeft className="w-4 h-4 text-[#0055FF] shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
