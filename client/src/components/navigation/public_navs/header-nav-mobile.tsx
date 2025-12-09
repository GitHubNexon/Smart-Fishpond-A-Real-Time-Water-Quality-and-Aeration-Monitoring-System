'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  homeSubMenus,
  servicesSubMenus,
  announcementsSubMenus,
  projectsSubMenus,
  aboutSubMenus,
} from './menus';

interface HeaderNavMobileProps {
  onNavigate?: () => void;
}

export default function HeaderNavMobile({ onNavigate }: HeaderNavMobileProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuSections = [
    { title: 'Home', items: homeSubMenus },
    { title: 'Services', items: servicesSubMenus },
    { title: 'Announcements', items: announcementsSubMenus },
    { title: 'Projects', items: projectsSubMenus },
    { title: 'About', items: aboutSubMenus },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const isHashLink = href.startsWith('/#') || href.startsWith('#');

    if (isHashLink) {
      if (pathname === '/') {
        // We're on home page, scroll directly
        e.preventDefault();
        const hash = href.includes('#') ? href.split('#')[1] : '';
        const element = document.getElementById(hash);

        if (element) {
          const headerOffset = 140; 
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.scrollY - headerOffset;

          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          });

          // Update URL
          window.history.pushState({}, '', href);

          // Close menu after scroll initiates
          setTimeout(() => onNavigate?.(), 300);
        } else {
          console.warn(`Element with id "${hash}" not found`);
          onNavigate?.();
        }
      } else {
        // We're on different page, navigate to home first
        e.preventDefault();
        router.push(href);
        onNavigate?.();
      }
    } else {
      // Regular route, close menu
      onNavigate?.();
    }
  };

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-1">
        {menuSections.map((menu) => (
          <AccordionItem
            key={menu.title}
            value={menu.title}
            className="border-none"
          >
            <AccordionTrigger className="text-white hover:bg-blue-800 hover:no-underline rounded-md px-3 py-2 font-medium text-left">
              {menu.title}
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="flex flex-col space-y-1 pl-2">
                {menu.items.map((item) => {
                  const Icon = item.icon;
                  const isHashLink =
                    item.href.startsWith('/#') || item.href.startsWith('#');

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      prefetch={!isHashLink}
                      className="flex items-start gap-3 rounded-md p-3 hover:bg-blue-800/50 transition-colors group"
                    >
                      {Icon && (
                        <Icon className="h-4 w-4 text-blue-200 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-white">
                          {item.title}
                        </span>
                        <span className="text-xs text-blue-200 leading-tight">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Reports - standalone link */}
      <Link
        href="/reports"
        onClick={() => onNavigate?.()}
        className="flex items-center text-white hover:bg-blue-800 rounded-md px-3 py-2 font-medium mt-1 transition-colors"
      >
        Reports
      </Link>
    </div>
  );
}
