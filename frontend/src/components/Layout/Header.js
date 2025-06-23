import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>Todo App</h1>
        </Link>
        
        <nav className="nav">
          {user ? (
            <div className="nav-authenticated">
              <span className="welcome">Welcome, {user.name}</span>
              <button onClick={logout} className="btn btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-unauthenticated">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
