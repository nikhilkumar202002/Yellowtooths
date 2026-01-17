'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import { getGallery } from '../../api/services/services';
import Logo from "../../../public/Logo/logo_full_size.svg"

export default function NavBar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const results = useQueries({
    queries: [
      {
        queryKey: ['gallery-nav'],
        queryFn: () => getGallery(),
      },
    ],
  });

  const galleryData = results[0].data;
  const hasGallery = Array.isArray(galleryData) && galleryData.length > 0;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkItem = 'rounded-full text-sm font-bold text-neutral-100 font-light';
  const navLinkItemContainer = 'bg-transparent p-0.5';

  const isLinkActive = (path: string) => {
    if (path === '/works' && pathname?.startsWith('/works')) {
      return true;
    }
    return pathname === path;
  };

  const handleCloseSheet = () => setIsSheetOpen(false);

  const handleVibrate = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
    }
  }, []);

  const workLinks = [
    { name: 'Film Poster Design', path: '/works/film-poster-design' },
    { name: 'Film Promotion', path: '/works/film-promotion' },
    { name: 'Branding', path: '/works/branding' },
    { name: 'Digital Marketing', path: '/works/digital-marketing' },
    {
      name: 'Technology & Experience Design',
      path: '/works/technology-&-experience-design',
    },
    { name: 'Video Production', path: '/works/video-production' },
    { name: 'Thinkery', path: '/works/thinkery' },
    { name: 'Global Academy of Artistry', path: '/works/global-academy-of-artistry' },
  ];

  return (
    <header
      className={`padding-primary fixed left-0 top-0 z-50 flex w-screen shrink-0 items-center justify-between py-[15px] transition-all duration-300 will-change-transform md:justify-between ${
        isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
      }`}>
      <Link href="/">
        <div className="py-2">
          {/* Corrected path to match footer and common folder structures */}
          <img
            src={Logo.src}
            className="h-6 w-auto object-cover"
            alt="Yellowtooths Logo"
          />
        </div>
      </Link>
      <div className={'flex items-center justify-center gap-4 pr-1'}>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              onClick={handleVibrate}
              variant="outline"
              size="icon"
              className="p-6 md:hidden">
              <MenuIcon className="h-6 w-6 text-black" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className={'flex w-full flex-col items-start justify-center'}>
            <div className="grid gap-2 font-beckman text-5xl uppercase tracking-wide">
              <Link
                href="/"
                className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                onClick={handleCloseSheet}>
                Home
              </Link>
              <Link
                href="/about"
                className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                onClick={handleCloseSheet}>
                About
              </Link>
              <div className="flex flex-col">
                <Link
                  href="/works"
                  className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                  onClick={handleCloseSheet}>
                  Services
                </Link>
                <div className="ml-4">
                  {workLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      className="hidden w-full items-center py-2 text-xl font-semibold text-neutral-300 hover:text-white"
                      onClick={handleCloseSheet}>
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              {hasGallery && (
                <Link
                  href="/gallery"
                  className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                  onClick={handleCloseSheet}>
                  Gallery
                </Link>
              )}
              <Link
                href="/blog"
                className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                onClick={handleCloseSheet}>
                Blog
              </Link>
              <Link
                href="/contact"
                className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                onClick={handleCloseSheet}>
                Contact
              </Link>
              <Link
                href="/careers"
                className="flex w-full items-center py-2 font-semibold text-neutral-300 hover:text-white"
                onClick={handleCloseSheet}>
                Careers
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className={'hidden items-center justify-center md:flex'}>
        <nav
          className={`hidden items-center gap-2 md:flex ${navLinkItemContainer} rounded-full`}>
          <Link
            href="/about"
            className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
              transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
              focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
              ${isLinkActive('/about') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
              dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
            About
          </Link>
          <div className="group relative">
            <Link
              href="/works"
              className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
                transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
                focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
                ${isLinkActive('/works') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
                dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
              Services <ChevronDown className="ml-1 h-4 w-4" />
            </Link>
            <div
              className="invisible absolute left-0 mt-2 w-max rounded-md border border-white/10 bg-neutral-950 opacity-0
                ring-0 ring-black ring-opacity-5 backdrop-blur-md transition-all duration-300 ease-in-out
                group-hover:visible group-hover:opacity-100">
              <div
                className="p-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu">
                {workLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className="block rounded px-4 py-2 text-sm text-neutral-300 duration-100 hover:bg-[#262626]
                      hover:text-neutral-50"
                    role="menuitem">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {hasGallery && (
            <Link
              href="/gallery"
              className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
                transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
                focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
                ${isLinkActive('/gallery') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
                dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
              Gallery
            </Link>
          )}
          <Link
            href="/blog"
            className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
              transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
              focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
              ${isLinkActive('/blog') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
              dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
            Blog
          </Link>
          <Link
            href="/contact"
            className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
              transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
              focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
              ${isLinkActive('/contact') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
              dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
            Contact
          </Link>
          <Link
            href="/careers"
            className={`group inline-flex h-9 w-max items-center justify-center ${navLinkItem} px-4 py-2 font-medium
              transition-all duration-300 ease-in-out hover:bg-neutral-100 hover:text-white focus:bg-white
              focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50
              ${isLinkActive('/careers') ? 'bg-white text-xl text-white' : 'text-neutral-300'}
              dark:bg-transparent dark:outline-0 dark:hover:text-[#fec52d] dark:focus:text-neutral-50`}>
            Careers
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="0" x2="32" y1="6" y2="6" />
      <line x1="0" x2="32" y1="14" y2="14" />
    </svg>
  );
}