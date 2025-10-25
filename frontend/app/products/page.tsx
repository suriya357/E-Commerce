'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  List,
  Shirt,
  Smartphone,
  Book,
  HeartPulse,
  SprayCan,
  Lamp,
} from 'lucide-react';

// Define types for our data
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
};
type Category = {
  category: string;
  product_count: string;
};

// This object maps a category name string to an Icon component
const categoryIcons: { [key: string]: React.ElementType } = {
    'All Products': List,
    'Electronics': Smartphone,
    'Fashion': Shirt,
    'Sports': HeartPulse,
    'Books': Book,
    'Home & Garden': Lamp,
    'Beauty': SprayCan,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const selectedCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  // Fetch categories when the page loads
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('http://localhost:5000/api/products/categories');
      const data = await res.json();
      const totalProducts = data.reduce((sum: number, cat: Category) => sum + parseInt(cat.product_count), 0);
      setCategories([{ category: 'All Products', product_count: totalProducts.toString() }, ...data]);
    }
    fetchCategories();
  }, []);

  // Fetch products when the page loads or when the filter changes
  useEffect(() => {
    async function fetchProducts() {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All Products') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const res = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
      setProducts(await res.json());
    }
    fetchProducts();
  }, [selectedCategory, searchQuery]); // Corrected dependency array

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'All Products') {
      router.push('/products');
    } else {
      router.push(`/products?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      {!searchQuery && (
        <>
          <div className="text-center mb-12">
            <LayoutGrid className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Shop by Category</h1>
            <p className="mt-4 text-lg text-muted-foreground">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
            {categories.map((cat) => {
              const IconComponent = categoryIcons[cat.category] || LayoutGrid;
              const isSelected = (!selectedCategory && cat.category === 'All Products') || selectedCategory === cat.category;
              
              return (
                <div
                  key={cat.category}
                  onClick={() => handleCategoryClick(cat.category)}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'bg-card hover:bg-muted'
                  }`}
                >
                  <IconComponent className="w-8 h-8" />
                  <p className="font-semibold">{cat.category}</p>
                  <p className="text-sm text-muted-foreground">{cat.product_count} items</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="text-3xl font-bold tracking-tight mb-8">
        {searchQuery ? `Results for "${searchQuery}"` : (selectedCategory || 'All Products')}
      </h2>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}