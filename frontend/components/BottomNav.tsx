'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/account', label: 'Account', icon: User },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // This container is fixed to the bottom of the screen and is only visible on screens smaller than "md"
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted">
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}