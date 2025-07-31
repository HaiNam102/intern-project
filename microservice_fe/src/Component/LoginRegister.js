import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/users/login', loginData);
      console.log('Response:', response.data);
      
      // Kiểm tra response và log để debug
      console.log('Login response:', response.data.data.jwt);
      console.log('Response code:', response.data.code);
      
      // Sửa lại điều kiện kiểm tra response code
      if (response.data.data != null) {
        // Lưu token
        localStorage.setItem('token', response.data.data.jwt);
        document.cookie = `refreshToken=${response.data.data.jwtRefresh}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict;`;
        console.log('Navigation triggered');
        // Thêm setTimeout để đảm bảo token được lưu trước khi navigate
        setTimeout(() => {
          navigate('/index');
        }, 100);
      } else {
        setError('Invalid response from server');
        console.log('Login failed - invalid response');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error details:', err.response || err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1f2029] font-poppins text-[#c4c3ca] relative">
      <a href="https://front.codes/" className="absolute top-6 right-6 z-10" target="_blank" rel="noreferrer">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="logo" className="h-6" />
      </a>

      <div className="flex justify-center items-center h-screen">
        <div className="text-center w-full max-w-md relative">
          <h6 className="mb-3 uppercase font-bold tracking-wider">
            <span className={`${!isFlipped ? 'text-[#ffeba7]' : ''}`}>Log In</span>
            <span className={`${isFlipped ? 'text-[#ffeba7]' : ''}`}> / Sign Up</span>
          </h6>

          {/* Toggle switch */}
          <label htmlFor="reg-log" className="block w-[60px] h-[16px] bg-[#ffeba7] rounded-full mx-auto cursor-pointer relative mb-6">
            <input
              type="checkbox"
              id="reg-log"
              className="hidden"
              checked={isFlipped}
              onChange={() => setIsFlipped(!isFlipped)}
            />
            <span className={`absolute top-[-10px] left-[-10px] w-9 h-9 bg-[#102770] text-[#ffeba7] rounded-full text-xl leading-9 text-center transform transition-transform duration-500 ${isFlipped ? 'translate-x-11 rotate-[-270deg]' : ''}`}>
              🔁
            </span>
          </label>

          {/* Card */}
          <div className="relative w-[440px] h-[400px] mx-auto perspective">
            <div className={`transition-all duration-500 transform-style-3d relative w-full h-full ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front Side (Login) */}
              <div className="absolute w-full h-full bg-[#2a2b38] rounded-md backface-hidden">
                <div className="p-8">
                  <h4 className="mb-4 font-semibold">Log In</h4>
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  <form onSubmit={handleLogin}>
                    <div className="mb-4 relative">
                      <input 
                        type="userName" 
                        name="userName"
                        value={loginData.userName}
                        onChange={handleInputChange}
                        placeholder="Your userName" 
                        className="form-input-style" 
                      />
                      <i className="absolute left-4 top-0 h-12 leading-[48px] text-[#ffeba7] text-xl">📧</i>
                    </div>
                    <div className="mb-4 relative">
                      <input 
                        type="password" 
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        placeholder="Your Password" 
                        className="form-input-style" 
                      />
                      <i className="absolute left-4 top-0 h-12 leading-[48px] text-[#ffeba7] text-xl">🔒</i>
                    </div>
                    <button type="submit" className="btn-style">Submit</button>
                    <p className="mt-4 text-sm">
                      <a href="#0" className="hover:text-[#ffeba7]">Forgot your password?</a>
                    </p>
                  </form>
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute w-full h-full bg-[#2a2b38] rounded-md backface-hidden rotate-y-180">
                <div className="p-8">
                  <h4 className="mb-4 font-semibold">Sign Up</h4>
                  <div className="mb-4 relative">
                    <input type="text" placeholder="Your Full Name" className="form-input-style" />
                    <i className="absolute left-4 top-0 h-12 leading-[48px] text-[#ffeba7] text-xl">🙍‍♂️</i>
                  </div>
                  <div className="mb-4 relative">
                    <input type="userName" placeholder="Your userName" className="form-input-style" />
                    <i className="absolute left-4 top-0 h-12 leading-[48px] text-[#ffeba7] text-xl">📧</i>
                  </div>
                  <div className="mb-4 relative">
                    <input type="password" placeholder="Your Password" className="form-input-style" />
                    <i className="absolute left-4 top-0 h-12 leading-[48px] text-[#ffeba7] text-xl">🔒</i>
                  </div>
                  <button className="btn-style">Submit</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
