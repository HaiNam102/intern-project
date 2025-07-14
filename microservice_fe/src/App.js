import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './Component/LoginRegister';
import Home from './Page/Home';
import OrderHistory from './Component/OrderHistory';
import './App.css';
import Cart from './Component/Cart';
import Chat from './Component/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;