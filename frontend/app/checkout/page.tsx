'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');

  const cartTotal = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  ).toFixed(2);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkpoint 1: handlePlaceOrder function started."); // <-- CHECKPOINT 1

    if (!token) {
      setError('You must be logged in to place an order.');
      router.push('/login');
      return;
    }
    console.log("Checkpoint 2: User token is valid."); // <-- CHECKPOINT 2

    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Shipping address is required.');
      return;
    }

    const orderDetails = {
      cartItems: cart,
      shippingAddress,
      totalPrice: cartTotal,
    };
    console.log("Checkpoint 3: Preparing to send order to backend:", orderDetails); // <-- CHECKPOINT 3

    try {
      const res = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderDetails),
      });

      console.log("Checkpoint 4: Received response from backend.", res); // <-- CHECKPOINT 4

      if (res.ok) {
        clearCart();
        router.push('/order-success');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error("A critical error occurred during fetch:", err);
      setError('A network error occurred. Is the backend server running?');
    }
  };

  // ... (The rest of your JSX code is the same)
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-8 text-4xl font-extrabold text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder}>
                <label htmlFor="address" className="block mb-2 font-semibold">Address</label>
                <Input
                  id="address"
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="123 Main St, Anytown, USA"
                  required
                />
                {error && <p className="mt-4 text-red-500">{error}</p>}
                <Button type="submit" size="lg" className="w-full mt-6 bg-green-500 hover:bg-green-600">
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}