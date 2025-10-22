import Link from 'next/link';

interface CardProps {
  href: string;
  title: string;
  description: string;
}

export default function Card({ href, title, description }: CardProps) {
  return (
    <div className="mb-12">
      <Link href={href} aria-label="go-to-app">
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-8 backdrop-blur-sm hover:border-slate-500/70 transition-colors cursor-pointer">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            {title}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}