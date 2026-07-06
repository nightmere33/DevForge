import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import OrderWizard from './pages/OrderWizard';
import Dashboard from './pages/dashboard/Dashboard';
import OrderDetail from './pages/dashboard/OrderDetail';
import AdminPage from './pages/admin/AdminPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: '#101A2E', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' },
            }}
          />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/order" element={<OrderWizard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute requireDeveloper><AdminPage /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppFloat />
          </div>
        </BrowserRouter>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
