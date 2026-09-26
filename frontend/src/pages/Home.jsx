import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './Home.css';

/**
 * Home Page – Bright Banking Theme with Bootstrap + Subtle Animations
 * All API calls, routes, and functionality remain unchanged.
 */
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* ══════════════════════════════════════════
                HERO SECTION
            ══════════════════════════════════════════ */}
            <section className="home-hero">
                <div className="home-hero-inner">

                    {/* Badge */}
                    <div className="hero-badge">
                        <span className="badge-pulse" />
                        Smart ATM Locator &amp; Cash Prediction
                    </div>

                    {/* Heading */}
                    <h1 className="hero-title">
                        <span className="highlight-blue">AI-Powered</span> ATM Cash
                        Availability Prediction &amp;{' '}
                        <span className="highlight-green">Smart ATM Locator</span>
                    </h1>

                    {/* Description */}
                    <p className="hero-description">
                        Find nearby ATMs and check their predicted cash availability before
                        you visit. Save time and avoid the frustration of empty ATMs with
                        real-time AI predictions.
                    </p>

                    {/* CTA Buttons */}
                    <div className="hero-actions">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/dashboard')}
                        >
                            {/* Search icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                            Find Nearby ATMs
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate('/dashboard')}
                        >
                            View Dashboard
                        </Button>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                STATUS LEGEND STRIP — Bootstrap badges
            ══════════════════════════════════════════ */}
            <div className="status-strip">
                <div className="status-strip-inner">
                    <div className="status-item">
                        <span className="status-dot green" />
                        <span className="badge bg-success-atm rounded-pill px-2 py-1 me-1">
                            Cash Available
                        </span>
                        / Operational
                    </div>
                    <div className="status-item">
                        <span className="status-dot orange" />
                        <span className="badge bg-warning-atm rounded-pill px-2 py-1 me-1">
                            Low Cash
                        </span>
                    </div>
                    <div className="status-item">
                        <span className="status-dot red" />
                        <span className="badge bg-danger-atm rounded-pill px-2 py-1 me-1">
                            Cash Unavailable
                        </span>
                        / Offline
                    </div>
                    <div className="status-item">
                        <span className="status-dot blue" />
                        <span className="badge bg-info-atm rounded-pill px-2 py-1 me-1">
                            ATM Info
                        </span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                FEATURE CARDS
            ══════════════════════════════════════════ */}
            <section className="features-section">
                <div className="features-heading">
                    <h2>Why use ATM Smart?</h2>
                    <p>Everything you need for a hassle-free cash experience.</p>
                </div>

                <div className="features-grid">

                    {/* Card 1 – Cash Availability */}
                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrap blue">
                            {/* Cash / wallet icon */}
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                <line x1="12" y1="12" x2="12" y2="16" />
                                <line x1="10" y1="14" x2="14" y2="14" />
                            </svg>
                        </div>
                        <h3>Cash Availability</h3>
                        <p>
                            Check predicted cash availability before visiting an ATM.
                            Never waste a trip to an empty machine again.
                        </p>
                    </div>

                    {/* Card 2 – Smart ATM Locator */}
                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrap green">
                            {/* Location pin icon */}
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3>Smart ATM Locator</h3>
                        <p>
                            Find nearby ATMs quickly using location-based search.
                            Get directions to the closest operational machine.
                        </p>
                    </div>

                    {/* Card 3 – AI Prediction */}
                    <div className="glass-card feature-card">
                        <div className="feature-icon-wrap accent">
                            {/* Activity / chart icon */}
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h3>AI Prediction</h3>
                        <p>
                            Predict ATM cash availability using historical transaction
                            patterns and machine learning models.
                        </p>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Home;
