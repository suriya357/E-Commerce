'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Ensure this is the full Product type
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
};

interface IWishlistContext {
  wishlist: Product[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<IWishlistContext | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (token) {
        const res = await fetch('http://localhost:5000/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setWishlist(await res.json());
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [token]);

  const addToWishlist = async (productId: number) => {
    if (!token) return;
    const res = await fetch('http://localhost:5000/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
        // Re-fetch the wishlist to get the full product details
        const updatedListRes = await fetch('http://localhost:5000/api/wishlist', { headers: { 'Authorization': `Bearer ${token}` } });
        setWishlist(await updatedListRes.json());
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!token) return;
    const res = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
        setWishlist(prev => prev.filter(item => item.id !== productId));
    }
  };

  const isInWishlist = (productId: number) => !!wishlist.find(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};