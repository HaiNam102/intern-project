import React, { useState, useEffect, JSX } from 'react';
import Header from '../Page/Header';
import Footer from '../Page/Footer';

interface UserResponse {
  nameOfUser: string;
  email: string;
  address: string;
}

interface ProductResponse {
  productName: string;
}

interface OrderResponse {
  orderId: number;
  quantityOrder: number;
  createdAt: number[];
  productResponse?: ProductResponse;
}

interface OrderHistoryData {
  userResponse: UserResponse;
  orderResponses: OrderResponse[];
}

const OrderHistory = (): JSX.Element => {
  const [orderHistory, setOrderHistory] = useState<OrderHistoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:8082/api/order', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.code === 1010) {
          setOrderHistory(data.data);
        } else {
          setError('Failed to fetch order history');
        }
      } catch (err) {
        setError('Error fetching order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Hàm format ngày tháng
  const formatDate = (dateArray: number[]): string => {
    if (!dateArray) return '';
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!orderHistory) return <></>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order History</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* User Information Card */}
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              User Information
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{orderHistory?.userResponse.nameOfUser}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{orderHistory?.userResponse.email}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-800">{orderHistory?.userResponse.address}</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Orders List History
            </h2>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderHistory?.orderResponses.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.productResponse?.productName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">
                          {order.quantityOrder}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistory;

