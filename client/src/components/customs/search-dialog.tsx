// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { SystemURL } from '@/lib/url-search';
// import { ArrowRight } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { X } from 'lucide-react';

// type Props = {
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   defaultOpen?: boolean;
// };

// export default function SearchDialog({
//   open: controlledOpen,
//   onOpenChange,
//   defaultOpen = true,
// }: Props) {
//   const router = useRouter();
//   const [internalOpen, setInternalOpen] = useState(defaultOpen);
//   const [query, setQuery] = useState('');
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const open = controlledOpen ?? internalOpen;

//   // focus input when opened
//   useEffect(() => {
//     if (open) inputRef.current?.focus();
//   }, [open]);

//   const urls = useMemo(() => SystemURL(), []);

//   const normalized = (s: string) => s.toLowerCase();

//   const filtered = useMemo(() => {
//     const q = query.trim();
//     if (!q) return urls;
//     const low = normalized(q);
//     return urls.filter((u) => normalized(u).includes(low));
//   }, [query, urls]);

//   function handleOpenChange(next: boolean) {
//     if (onOpenChange) onOpenChange(next);
//     else setInternalOpen(next);

//     if (!next && !onOpenChange) {
//       if (typeof window !== 'undefined') {
//         if (window.history.length > 1) router.back();
//         else router.push('/');
//       }
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       <DialogContent className="w-full max-w-2xl mx-auto bg-zinc-300 text-black dark:bg-accent  dark:text-white rounded-lg p-4 shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="text-lg">Search Pages</DialogTitle>
//         </DialogHeader>

//         {/* Search input */}
//         <div className="mt-3">
//           <Input
//             ref={inputRef}
//             placeholder="Search..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full"
//             aria-label="Search pages"
//           />
//         </div>

//         {/* Search results */}
//         <div className="mt-4">
//           {filtered.length === 0 ? (
//             <div className="py-8 text-center">
//               <p className="text-sm font-medium">No results</p>
//               <p className="mt-2 text-xs text-muted-foreground">
//                 This page does not exist. Try another search or check the
//                 recommendations below.
//               </p>
//             </div>
//           ) : (
//             <>
//               <h4 className="text-xs font-semibold mb-2">Pages</h4>
//               <ul className="space-y-2 max-h-64 overflow-auto">
//                 {filtered.map((u) => (
//                   <li key={u}>
//                     <button
//                       onClick={() => {
//                         handleOpenChange(false);
//                         setTimeout(() => router.push(u), 80);
//                       }}
//                       className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-between"
//                     >
//                       <div className="flex items-center gap-2 truncate">
//                         <ArrowRight
//                           size={16}
//                           className="text-muted-foreground"
//                         />
//                         <span>{u.replace(/^\//, '') || 'home'}</span>
//                       </div>
//                       <div className="ml-4 text-xs opacity-70">Open</div>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>

//         {/* Close button */}
//         <DialogClose asChild>
//           <button
//             className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
//             aria-label="Close search"
//           >
//             <X size={16} />
//           </button>
//         </DialogClose>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SystemURL } from '@/lib/url-search';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Props = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

type CategoryConfig = {
  label: string;
  pathPrefix: string; // for dynamic redirects
  hasRecommendations: boolean;
};

export default function SearchDialog({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = true,
}: Props) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryConfig | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = controlledOpen ?? internalOpen;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const urls = useMemo(() => SystemURL(), []);

  const normalized = (s: string) => s.toLowerCase();

  // DRY category configuration
  const categories: CategoryConfig[] = useMemo(
    () => [
      { label: 'Pages', pathPrefix: '', hasRecommendations: true },
      {
        label: 'Employees',
        pathPrefix: '/employee/',
        hasRecommendations: false,
      },
      { label: 'Assets', pathPrefix: '/asset/', hasRecommendations: false },
      {
        label: 'Inventory',
        pathPrefix: '/inventory/',
        hasRecommendations: false,
      },
    ],
    [],
  );

  // Only Pages have recommendations
  const pageRecommendations = useMemo(() => {
    if (!activeCategory?.hasRecommendations) return [];
    const q = query.trim().toLowerCase();
    return urls
      .filter((url) => !q || normalized(url).includes(q))
      .map((url) => ({
        label: url.replace(/^\//, '') || 'home',
        path: url,
      }));
  }, [query, urls, activeCategory]);

  function handleOpenChange(next: boolean) {
    if (onOpenChange) onOpenChange(next);
    else setInternalOpen(next);

    if (!next && !onOpenChange) {
      if (typeof window !== 'undefined') {
        if (window.history.length > 1) router.back();
        else router.push('/');
      }
    }
  }

  function handleNavigate(path: string) {
    handleOpenChange(false);
    setTimeout(() => router.push(path), 80);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && activeCategory) {
      if (activeCategory.hasRecommendations) {
        // Pages: navigate to first match if exists
        if (pageRecommendations[0]) handleNavigate(pageRecommendations[0].path);
      } else {
        // Any other category: use its pathPrefix + query
        if (query.trim())
          handleNavigate(activeCategory.pathPrefix + query.trim());
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full max-w-2xl mx-auto bg-zinc-300 text-black dark:bg-accent  dark:text-white rounded-lg p-4 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Search</DialogTitle>
        </DialogHeader>

        <div className="mt-3">
          <Input
            ref={inputRef}
            placeholder="What are you searching for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
            aria-label="Search"
          />
        </div>

        <div className="mt-4 max-h-64 overflow-auto">
          {!activeCategory && (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-between"
                  >
                    <span>{cat.label}</span>
                    <ArrowRight size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {activeCategory && (
            <>
              {/* Go Back */}
              <button
                onClick={() => setActiveCategory(null)}
                className="mb-2 flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <ArrowLeft size={16} /> Back to categories
              </button>

              {activeCategory.hasRecommendations && (
                <>
                  <h4 className="text-xs font-semibold mb-2">
                    {activeCategory.label}
                  </h4>
                  {pageRecommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No results found.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {pageRecommendations.map((item) => (
                        <li key={item.path}>
                          <button
                            onClick={() => handleNavigate(item.path)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-between"
                          >
                            <span>{item.label}</span>
                            <div className="ml-4 text-xs opacity-70">Open</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {!activeCategory.hasRecommendations && (
                <p className="text-sm text-muted-foreground">
                  Type {activeCategory.label.slice(0, -1)} ID above and press
                  Enter to go.
                </p>
              )}
            </>
          )}
        </div>

        <DialogClose asChild>
          <button
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
