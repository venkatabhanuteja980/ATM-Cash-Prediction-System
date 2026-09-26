import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { registerUser } from '../services/api';
import './AuthPages.css';

/**
 * Register Page – Bright Banking Theme with Bootstrap alerts + spinner
 * All API calls, password validation, and auth logic are completely unchanged.
 */
const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        // Check password confirmation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);

            const data = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setMessage(data.message);

            // Clear form after successful registration
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="glass-card auth-card">

                {/* ── Header ── */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5"
                             strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M6 12h.01M18 12h.01" />
                        </svg>
                    </div>
                    <h2>Create Account</h2>
                    <p>Join ATM Smart to locate cash-available ATMs effortlessly</p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="auth-form">

                    {/* Bootstrap success alert */}
                    {message && (
                        <div className="alert alert-success d-flex align-items-center gap-2"
                             role="alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {message}
                        </div>
                    )}

                    {/* Bootstrap danger alert */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2"
                             role="alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-spinner-row">
                                <span
                                    className="spinner-border spinner-border-sm text-white"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Creating Account…
                            </span>
                        ) : 'Register'}
                    </Button>
                </form>

                {/* ── Footer ── */}
                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
