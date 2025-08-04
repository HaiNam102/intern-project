import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './Component/LoginRegister';
import Home from './Page/Home';
import OrderHistory from './Component/OrderHistory';
import './App.css';
import 'antd/dist/reset.css'; // Import Ant Design CSS
import Cart from './Component/Cart';
import Chat from './Component/Chat';
import CameraList from './Component/CameraList';
import CameraStream from './Component/CameraStream';
import CreateCamera from './Component/CreateCamera';
import EditCamera from './Component/EditCamera';
import CameraDetail from './Component/CameraDetail';
import CameraDashboard from './Component/CameraDashboard';

// Import WebSocket test utilities for development
if (process.env.NODE_ENV === 'development') {
  import('./utils/websocketTest');
}

function App() {
  return (
    <Router>
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/cameras" element={<CameraList />} />
          <Route path="/camera/dashboard" element={<CameraDashboard />} />
          <Route path="/camera/create" element={<CreateCamera />} />
          <Route path="/camera/edit/:id" element={<EditCamera />} />
          <Route path="/camera/detail/:id" element={<CameraDetail />} />
          <Route path="/camera/:cameraId" element={<CameraStream />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;