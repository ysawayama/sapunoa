'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  BeakerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'ホーム', href: '/dashboard', icon: HomeIcon },
  { name: '検査結果', href: '/test-results', icon: DocumentTextIcon },
  { name: '予約', href: '/appointments', icon: CalendarIcon },
  { name: 'サプリ', href: '/supplements', icon: BeakerIcon },
  { name: 'マイページ', href: '/profile', icon: UserIcon },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center px-4 py-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/images/sapunoa-logo2.png"
              alt="サプノア"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-lg font-semibold text-gray-900">サプノア</span>
          </Link>
        </div>
      </header>
      
      {/* Main content - full width on mobile */}
      <main className="pt-14 pb-20">
        {children}
      </main>
      
      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center py-2 text-xs
                  ${isActive
                    ? 'text-primary-600'
                    : 'text-gray-400'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}