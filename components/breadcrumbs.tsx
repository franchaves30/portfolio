// File: components/breadcrumbs.tsx

import Link from 'next/link';

// We define a 'prop' (property) so we can pass in the page title
type BreadcrumbsProps = {
  currentPage: string;
};

export function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-gray-400 mb-4">
      <Link 
        href="/case-studies" 
        className="hover:text-white transition-colors"
      >
        Case Studies
      </Link>
      <span className="mx-2">&gt;</span>
      <span className="text-gray-500">{currentPage}</span>
    </nav>
  );
}