import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'A simple e-commerce store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main className="pb-20 md:pb-0">{children}</main>
                <BottomNav />
                <Toaster
                  position="top-center"
                  richColors
                  toastOptions={{
                    classNames: {
                      toast: 'w-[400px] p-4',
                      title: 'text-lg font-semibold',
                      description: 'text-base',
                    },
                  }}
                />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}