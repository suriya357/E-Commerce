'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define types
type Product = {
  id: number; name: string; description: string; price: string; image_url: string;
};
type CartItem = Product & { quantity: number };

// Define context shape, adding clearCart
interface ICartContext {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void; // Add this function
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { token } = useAuth();

  // Effect to fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();
  }, [token]);

  // Effect to save cart to backend whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      // Only save if the user is logged in and the cart is not in its initial empty state
      if (token && cart.length > 0) {
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(cart),
        });
      }
    };
    saveCart();
  }, [cart, token]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const decrementQuantity = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Add the new clearCart function
  const clearCart = () => {
    setCart([]);
  };

  return (
    // Add clearCart to the provider's value
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, decrementQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};