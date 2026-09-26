import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { loginUser, googleLoginUser } from '../services/api';
import { GoogleLogin } from '@react-oauth/google';
import './AuthPages.css';

/**
 * Login Page – Bright Banking Theme with Bootstrap alerts + spinner
 * All API calls, JWT logic, and routing are completely unchanged.
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);

            const data = await loginUser({ email, password });

            // Store JWT token
            localStorage.setItem('token', data.token);

            // Store user information
            localStorage.setItem('user', JSON.stringify(data.user));

            // Go to dashboard
            navigate('/dashboard');

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
                    <h2>Welcome Back</h2>
                    <p>Sign in to access your ATM Smart dashboard</p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="auth-form">

                    {/* Bootstrap alert for errors */}
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
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {/* Bootstrap spinner shown when loading */}
                        {loading ? (
                            <span className="auth-spinner-row">
                                <span
                                    className="spinner-border spinner-border-sm text-white"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Signing in…
                            </span>
                        ) : 'Login'}
                    </Button>
                    <div className="text-center my-3">
    <span className="text-muted">OR</span>
</div>

<div className="d-flex justify-content-center">
   <GoogleLogin
    onSuccess={async (credentialResponse) => {
        try {
            setError('');
            setLoading(true);

            const data = await googleLoginUser(
                credentialResponse.credential
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }}
    onError={() => {
        setError('Google Login Failed');
    }}
/>
</div>
                </form>

                {/* ── Footer ── */}
                <div className="auth-footer">
                    <p>
                        Don&apos;t have an account?{' '}
                        <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;