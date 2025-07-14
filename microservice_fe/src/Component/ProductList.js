import React from 'react';
import { useNavigate } from 'react-router-dom';

// Mảng các ảnh mẫu để sử dụng
const sampleImages = [
  'https://picsum.photos/400/300',
  'https://picsum.photos/400/301',
  'https://picsum.photos/400/302',
  'https://picsum.photos/400/303',
  'https://picsum.photos/400/304',
];

const ProductList = ({ products, loading, error }) => {
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = currentCart.find(item => item.productId === product.productId);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(item =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { 
        productId: product.productId,
        productName: product.productName,
        quantity: 1,
        imageUrl: sampleImages[Math.floor(Math.random() * sampleImages.length)]
      }];
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    navigate('/cart');
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div 
          key={product.productId}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={sampleImages[index % sampleImages.length]}
              alt={product.productName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {product.productName}
            </h2>
            <p className="text-gray-600">
              Quantity in stock: {product.quantity}
            </p>
            <button 
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;