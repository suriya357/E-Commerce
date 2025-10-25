'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          Discover Amazing Products
        </h1>
        <p className="max-w-2xl mx-auto mt-4 text-lg text-blue-100">
          Shop from thousands of products across multiple categories with fast delivery and great prices
        </p>
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-6 text-lg rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
    </section>
  );
}