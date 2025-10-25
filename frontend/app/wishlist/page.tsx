'use client';

import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container p-4 mx-auto">
      <div className="text-center mb-12">
        <Heart className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">My Wishlist</h1>
      </div>
      {wishlist.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Your wishlist is empty.{" "}
          <Link href="/" className="text-primary hover:underline">
            Start adding some products!
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}