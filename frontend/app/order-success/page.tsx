'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto p-4 text-center flex flex-col items-center justify-center h-[60vh]">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-extrabold mb-4">Thank You For Your Order!</h1>
      <p className="text-lg text-muted-foreground mb-8">Your order has been placed successfully.</p>
      <Button asChild>
        <Link href="/">Continue Shopping</Link>
      </Button>
    </div>
  );
}