'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import {
  homeSubMenus,
  servicesSubMenus,
  announcementsSubMenus,
  projectsSubMenus,
  aboutSubMenus,
} from './menus';

// Helper function to handle smooth scrolling for hash links
const handleHashClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => {
  const isHashLink = href.startsWith('/#') || href.startsWith('#');

  if (isHashLink) {
    e.preventDefault();
    const hash = href.includes('#') ? '#' + href.split('#')[1] : href;
    const element = document.querySelector(hash);

    if (element) {
      const headerOffset = 75;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      window.history.pushState(null, '', href);
    } else {
      console.warn(`Element with selector "${hash}" not found`);
    }
  }
};

// --- Main Navigation ---
export default function HeaderNavDesktop() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="ml-auto">
      <NavigationMenuList className="flex space-x-2">
        {[
          { title: 'Home', items: homeSubMenus },
          { title: 'Services', items: servicesSubMenus },
          { title: 'Announcements', items: announcementsSubMenus },
          { title: 'Projects', items: projectsSubMenus },
          { title: 'About', items: aboutSubMenus },
        ].map((menu) => (
          <NavigationMenuItem key={menu.title}>
            <NavigationMenuTrigger
              onClick={(e) => e.preventDefault()}
              className="
                bg-white font-medium
                text-blue-600 hover:bg-blue-50 hover:text-blue-800
                data-[state=open]:bg-blue-50 data-[state=open]:text-blue-800
                dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300
                dark:data-[state=open]:bg-blue-900 dark:data-[state=open]:text-blue-300
                transition-colors duration-200 rounded-md px-3 py-2
              "
            >
              {menu.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {menu.items.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* Reports - no submenu */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/reports"
              className={cn(
                navigationMenuTriggerStyle(),
                'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-800 data-[active]:bg-blue-50 data-[active]:text-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:data-[active]:bg-blue-900 dark:data-[active]:text-blue-300 rounded-md px-3 py-2 font-medium',
              )}
            >
              Reports
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// --- Submenu List Item ---
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    title: string;
    icon?: React.ElementType;
  }
>(({ className, title, children, href, icon: Icon, ...props }, ref) => {
  const pathname = usePathname();
  const isHashLink = href?.startsWith('/#') || href?.startsWith('#');
  const isCurrentPage = pathname === '/' && isHashLink;

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || '#'}
          onClick={(e) => {
            if (href) {
              // If we're on the home page and clicking a hash link, use smooth scroll
              if (pathname === '/' && isHashLink) {
                handleHashClick(e, href);
              }
              // Otherwise, Next.js Link will handle routing normally
            }
          }}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-950',
            className,
          )}
          // SEO: Use prefetch for better performance
          prefetch={!isHashLink}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
            <div className="text-sm font-medium leading-none text-blue-600 dark:text-blue-400">
              {title}
            </div>
          </div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-blue-500 dark:text-blue-300">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
