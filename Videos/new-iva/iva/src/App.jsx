import './App.css';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import Configuration from './pages/Configuration';
import Order from './pages/Makechecker';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import User from './pages/User';
import Sidebar from './components/Sidebar';
import SinginSinup from './components/Face/SinginSinup'; // Login Component
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './uitls/ProtectedRoutes';
import TopNavbar from './components/Navbar/TopNavbar';
import Makechecker from './pages/Makechecker';
import Manualscan from './pages/Manualscan';
import ChatBot from 'react-simple-chatbot';
function App() {
  return (
    <div className="app-container">
      
      <Router>
        
        <Routes>
          <Route path="/login" element={<SinginSinup />} />
          <Route element={<ProtectedRoutes />}>
            <Route element={<Sidebar />}>
            
              <Route path="/overview" element={<Dashboard />} />
              <Route path="/manualscan" element={<Manualscan />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/makechecker" element={<Makechecker/>} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/user" element={<User />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unknown paths */}
        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
