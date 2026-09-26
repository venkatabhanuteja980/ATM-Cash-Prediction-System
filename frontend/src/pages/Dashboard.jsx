import React from 'react';
import './Dashboard.css';

/**
 * Dashboard Page – Bright Banking Theme with Bootstrap badges, spinner, and animations.
 * Displays a professional welcome card; ready for backend API integration.
 * No API calls, routes, or functionality changed.
 */
const Dashboard = () => {
    return (
        <div className="page-wrapper">
            <div className="glass-card dashboard-placeholder-card">

                {/* Floating ATM Icon */}
                <div className="dashboard-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                        <path d="M6 12h.01M18 12h.01" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="dashboard-title">Welcome to ATM Smart</h1>

                {/* Message */}
                <p className="dashboard-message">
                    The ATM cash availability prediction dashboard and locator tools will be
                    available after authentication and backend API integration.
                </p>

                {/* Bootstrap info alert for context */}
                <div className="alert alert-info d-flex align-items-center gap-2 mb-4 text-start w-100"
                     role="alert" style={{ fontSize: '0.875rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5"
                         strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Connect the backend API to enable real-time ATM predictions and the
                    smart locator features.
                </div>

                {/* Bootstrap ATM status badges demo */}
                <div className="d-flex gap-2 flex-wrap justify-content-center mb-4">
                    <span className="badge bg-success-atm rounded-pill px-3 py-2">
                        Cash Available
                    </span>
                    <span className="badge bg-warning-atm rounded-pill px-3 py-2">
                        Low Cash
                    </span>
                    <span className="badge bg-danger-atm rounded-pill px-3 py-2">
                        Cash Unavailable
                    </span>
                    <span className="badge bg-info-atm rounded-pill px-3 py-2">
                        Operational
                    </span>
                </div>

                {/* Status tag */}
                <div className="dashboard-status-tag">
                    <span className="status-dot" />
                    System Ready for Backend Integration
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
