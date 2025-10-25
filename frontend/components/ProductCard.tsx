'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { ShoppingCart, Zap, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';

type Product = {
  id: number; name: string; description: string; price: string; image_url: string;
};

interface ProductCardProps {
  product: Product;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { token } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCartClick = () => {
    addToCart(product);
    // Use toast.success for a green pop-up
    toast.success("Added to Cart!", {
        description: `${product.name} is now in your cart.`,
        duration: 2000,
    });
  };

  const handleWishlistClick = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
      // Use toast.error for a red pop-up
      toast.error("Removed from Wishlist", {
        description: `${product.name} has been removed.`,
        duration: 2000,
      });
    } else {
      addToWishlist(product.id);
      // Use toast.success for a green pop-up
      toast.success("Added to Wishlist!", {
        description: `${product.name} has been saved.`,
        duration: 2000,
      });
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      router.push('/login');
    } else {
      addToCart(product);
      router.push('/cart');
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="relative flex flex-col h-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={handleWishlistClick}
        >
          <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} />
        </Button>
        <CardHeader>
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-48 mb-4 rounded-md"
          />
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-lg font-semibold text-gray-800">${product.price}</p>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleAddToCartClick}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button onClick={handleBuyNow}>
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}