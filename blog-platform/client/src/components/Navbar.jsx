import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Feather, Moon, Sun, Menu, X, PenSquare, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30'
      : 'text-ink-600 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-ink-50 dark:hover:bg-ink-800'
  }`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 dark:border-ink-800 bg-paper-light/90 dark:bg-paper-dark/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 text-white">
              <Feather className="h-4.5 w-4.5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Inkwell</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink to="/create" className={navLinkClass}>
                Write
              </NavLink>
            )}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="btn-ghost h-9 w-9 p-0 rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/create" className="btn-primary">
                  <PenSquare className="h-4 w-4" />
                  New Post
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
                  title="Profile"
                >
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-accent-200 text-accent-800 font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </Link>
                <button onClick={handleLogout} className="btn-ghost" title="Log out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="btn-ghost h-9 w-9 p-0 rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="btn-ghost h-9 w-9 p-0 rounded-full"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-ink-100 dark:border-ink-800 py-3 flex flex-col gap-1">
            <NavLink to="/" className={navLinkClass} end onClick={closeMenu}>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMenu}>
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </span>
                </NavLink>
                <NavLink to="/create" className={navLinkClass} onClick={closeMenu}>
                  <span className="inline-flex items-center gap-2">
                    <PenSquare className="h-4 w-4" /> Write
                  </span>
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </span>
                </NavLink>
                <button onClick={handleLogout} className="text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                  <span className="inline-flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Log out
                  </span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={navLinkClass} onClick={closeMenu}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
