import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Thêm state quản lý đăng nhập
  const [showDropdown, setShowDropdown] = useState(false); // State để điều khiển dropdown

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Chuyển đổi token thành boolean
  }, []); // Empty dependency array means this runs once when component mounts

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token khi logout
    setIsLoggedIn(false);
    setShowDropdown(false);
    // Thêm logic xử lý logout ở đây (clear localStorage, etc.)
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">MyShop</Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/history" className="hover:text-gray-300">History</Link>
            <Link to="/cart" className="hover:text-gray-300">Cart</Link>
            <Link to="/camera/dashboard" className="hover:text-gray-300">Cameras</Link>
            
            {!isLoggedIn ? (
              <Link to="/login" className="hover:text-gray-300">Login</Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <img 
                    src="https://picsum.photos/400/304"   
                    alt="User" 
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;