'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, addToCart, decrementQuantity, removeFromCart } = useCart();

  const cartTotal = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  ).toFixed(2);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-8 text-4xl font-extrabold text-center tracking-tight lg:text-5xl">
        Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
            <p className="mb-4 text-xl text-muted-foreground">Your cart is empty.</p>
            <Button asChild>
                <Link href="/">Go Shopping!</Link>
            </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="flex items-center p-4">
                <img src={item.image_url} alt={item.name} className="object-cover w-24 h-24 rounded-md" />
                <div className="flex-grow ml-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-muted-foreground">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => decrementQuantity(item.id)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => addToCart(item)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch pt-4 border-t">
               <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>
              {/* This is the updated button */}
              <Button size="lg" asChild className="w-full bg-green-500 hover:bg-green-600">
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}