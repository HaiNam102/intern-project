import React, { useState, useEffect, JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Page/Header';
import { jwtDecode } from 'jwt-decode'; // Updated import statement

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  imageUrl?: string;
}

interface DecodedToken {
  userId: number;
}

const Cart = (): JSX.Element => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items: CartItem[]): void => {
    const sum = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setTotal(sum);
  };

  const updateQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (productId: number): void => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token); // Using jwtDecode instead of jwt_decode
      return decoded.userId; // Điều chỉnh theo cấu trúc thực tế của token
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleCheckout = async (): Promise<void> => {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Tạo mảng promises cho tất cả các API calls
      const orderPromises = cartItems.map(item => {
        const orderData = {
          userId: Number(userId), 
          productId: Number(item.productId), 
          quantityOrder: Number(item.quantity) 
        };

        return fetch('http://localhost:8082/api/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(orderData)
        });
      });

      // Chờ tất cả các API calls hoàn thành
      const responses = await Promise.all(orderPromises);
      
      // Kiểm tra responses
      const hasError = responses.some(response => !response.ok);
      
      if (hasError) {
        throw new Error('Some orders failed to process');
      }

      // Clear cart sau khi đặt hàng thành công
      localStorage.removeItem('cart');
      setCartItems([]);
      calculateTotal([]);
      
      // Chuyển hướng đến trang lịch sử đơn hàng
      alert('Order placed successfully!');
      navigate('/history');

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={item.imageUrl || 'https://picsum.photos/200'} 
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Items: {total}</span>
                <button 
                  className={`
                    bg-blue-600 text-white px-6 py-2 rounded-md
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                  `}
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? 'Processing...' : 'Order Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

