import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

/**
 * Navbar Component for ATM Smart – Bright Banking Theme with Animations
 */
const Navbar = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* Brand */}
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <div className="brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M6 12h.01M18 12h.01" />
                        </svg>
                    </div>
                    <span className="brand-text">
                        ATM <span className="brand-highlight">Smart</span>
                    </span>
                </Link>

                {/* Desktop / mobile nav */}
                <nav className={`navbar-links${menuOpen ? ' open' : ''}`}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `nav-item${isActive ? ' nav-item--active' : ''}`}
                        end
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-item${isActive ? ' nav-item--active' : ''}`}
                        onClick={closeMenu}
                    >
                        Dashboard
                    </NavLink>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <NavLink
                                    to="/admin-dashboard"
                                    className={({ isActive }) =>
                                        `nav-item nav-item--admin${isActive ? ' nav-item--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Admin Dashboard
                                </NavLink>
                            )}

                            <button
                                type="button"
                                className="nav-item nav-item--logout border-0 bg-transparent"
                                onClick={handleLogout}
                                style={{ cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `nav-item${isActive ? ' nav-item--active' : ''}`}
                                onClick={closeMenu}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={({ isActive }) =>
                                    `nav-item${isActive ? ' nav-item--active' : ''}`}
                                onClick={closeMenu}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Hamburger — animates to × when open */}
                <button
                    className={`navbar-toggle${menuOpen ? ' open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
