'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react'; // 1. Import useState and useEffect
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Heart, LogOut, Package2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  const { cart } = useCart();
  const { token, email, logout } = useAuth();
  const { wishlist } = useWishlist();
  
  // 2. Add state to track if component has mounted in the browser
  const [isMounted, setIsMounted] = useState(false);

  // 3. Set isMounted to true only after the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userEmail = email || "Loading...";
  const userInitial = userEmail !== "Loading..." ? userEmail.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex items-center justify-between h-16 mx-auto">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Package2 className="w-6 h-6 text-primary" />
          <span className="font-bold">ShopCart</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Icons visible to everyone */}
          <Button asChild variant="ghost" className="relative">
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5" />
              {/* Only render cart count if mounted to prevent mismatch */}
              {isMounted && cart.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </Button>

          {/* 4. Only render the Auth/Wishlist dependent UI *after* mounting */}
          {isMounted && (
            <>
              {token && (
                <Button asChild variant="ghost" className="relative">
                  <Link href="/wishlist">
                    <Heart className="w-5 h-5" />
                    {wishlist.length > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                </Button>
              )}

              {token ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="relative w-8 h-8 rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              )}
            </>
          )} {/* End of isMounted check */}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}