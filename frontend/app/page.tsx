'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import Hero from '@/components/Hero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // 1. Import motion

type Product = {
  id: number; name: string; description: string; price: string; image_url: string;
};

// 2. Define the animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // This will make each card animate one after the other
    },
  },
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function getProducts() {
      const res = await fetch('http://localhost:5000/api/products');
      setProducts(await res.json());
    }
    getProducts();
  }, []);

  return (
    <>
      <Hero />
      <main className="container p-1 py-11 mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-4xl font-bold tracking-tight">Featured Products</h2>
                <p className="text-muted-foreground">Discover our most popular items</p>
            </div>
            <Link href="/products" className="flex items-center gap-2 text-lg font-semibold text-primary hover:underline">
                Show By Category <ArrowRight className="w-8 h-8" />
            </Link>
        </div>
        {/* 3. Wrap the grid in a motion.div and apply the variants */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </main>
    </>
  );
}