/**
 * Header Component
 *
 * Displays user menu with logout functionality
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="header-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span className="header-title">Plant Care</span>
        </div>

        {user && (
          <div className="user-menu">
            <button
              className="user-menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div className="user-avatar">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-email">{user.email}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`menu-arrow ${showMenu ? 'menu-arrow-open' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="menu-overlay" onClick={() => setShowMenu(false)} />
                <div className="user-dropdown">
                  <div className="dropdown-item dropdown-info">
                    <div className="user-info-label">Signed in as</div>
                    <div className="user-info-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item dropdown-button"
                    onClick={handleLogout}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
