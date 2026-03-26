import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sorting Algorithms | Stephen Radix',
  description: 'Interactive algorithm visualization and learning platform.',
};

export default function SortingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background stays in layout for smooth transitions */}
      <div className="fixed inset-0 -z-10 bg-zinc-50 dark:bg-zinc-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-zinc-50 to-zinc-50 dark:from-blue-900/10 dark:via-zinc-950 dark:to-zinc-950" />
      
      {/* Content wrapper */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
