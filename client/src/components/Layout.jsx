import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/home') return 'Home';
    if (path === '/products') return 'Products';
    return 'Productr';
  };

  const getPageIcon = () => {
    const path = location.pathname;
    if (path === '/home') return <img src="/images/home-icon-black.svg" alt="Home" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px' }} />;
    if (path === '/products') return <img src="/images/products-icon-black.svg" alt="Products" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '8px' }} />;
    return null;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    if (user?.phone) {
      return user.phone.charAt(0);
    }
    return 'U';
  };

  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <span className="page-title">{getPageIcon()}{getPageTitle()}</span>
          </div>
          
          <div className="header-right">
            <input 
              type="text" 
              placeholder="Search Services, Products" 
              className="search-bar"
            />
            
            <div 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {getUserInitial()}
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
