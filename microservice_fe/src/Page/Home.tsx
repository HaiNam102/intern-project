import React, { useState, useEffect, JSX } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import ProductList from '../Component/ProductList';

// Remove this interface and import Product from a shared types file
// Define Product type here if not available elsewhere
export interface Product {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}


const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:8082/api/products');
        if (response.data.code === 1010) {
          setProducts(response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>
          <ProductList products={products} loading={loading} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

