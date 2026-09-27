import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getATMs, createATM, updateATM, deleteATM } from '../services/api';
import './AdminDashboard.css';

/**
 * Admin Dashboard Page - ATM Cash Prediction System
 * Requires role === "admin". Otherwise displays Access Denied UI.
 * Provides complete ATM CRUD management (Add, Edit, Delete).
 */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [atms, setAtms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionNotice, setActionNotice] = useState('');

    // Modal & Form state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
    const [selectedAtmId, setSelectedAtmId] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [formData, setFormData] = useState({
        atmId: '',
        atmName: '',
        bankName: '',
        address: '',
        latitude: '',
        longitude: '',
        status: 'active',
        cashLevel: 'high'
    });

    // Delete Confirmation dialog state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [atmToDelete, setAtmToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Inspect user authentication & role
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let user = null;

    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        user = null;
    }

    const isAdmin = Boolean(user && token && user.role === 'admin');

    useEffect(() => {
        if (isAdmin) {
            fetchATMs();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const fetchATMs = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getATMs();
            setAtms(data.atms || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch ATMs from server');
        } finally {
            setLoading(false);
        }
    };

    // Form input change handler
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Open Modal for Creating new ATM
    const handleAddClick = () => {
        setModalMode('create');
        setSelectedAtmId(null);
        setFormData({
            atmId: '',
            atmName: '',
            bankName: '',
            address: '',
            latitude: '',
            longitude: '',
            status: 'active',
            cashLevel: 'high'
        });
        setModalError('');
        setShowModal(true);
    };

    // Open Modal for Editing existing ATM
    const handleEditClick = (atm) => {
        setModalMode('edit');
        setSelectedAtmId(atm._id);
        setFormData({
            atmId: atm.atmId || '',
            atmName: atm.atmName || '',
            bankName: atm.bankName || '',
            address: atm.address || '',
            latitude: atm.latitude !== undefined ? atm.latitude : '',
            longitude: atm.longitude !== undefined ? atm.longitude : '',
            status: atm.status || 'active',
            cashLevel: atm.cashLevel || 'high'
        });
        setModalError('');
        setShowModal(true);
    };

    // Handle Form Submit (Create or Update)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setModalError('');

        // Required field validation
        if (
            !formData.atmId.trim() ||
            !formData.atmName.trim() ||
            !formData.bankName.trim() ||
            !formData.address.trim() ||
            formData.latitude === '' ||
            formData.longitude === ''
        ) {
            setModalError('Please fill in all required fields.');
            return;
        }

        const latNum = Number(formData.latitude);
        const lngNum = Number(formData.longitude);

        if (isNaN(latNum) || isNaN(lngNum)) {
            setModalError('Latitude and Longitude must be valid numbers.');
            return;
        }

        const payload = {
            atmId: formData.atmId.trim(),
            atmName: formData.atmName.trim(),
            bankName: formData.bankName.trim(),
            address: formData.address.trim(),
            latitude: latNum,
            longitude: lngNum,
            status: formData.status,
            cashLevel: formData.cashLevel
        };

        try {
            setSubmitLoading(true);
            if (modalMode === 'create') {
                await createATM(payload);
                setActionNotice(`ATM "${payload.atmName}" added successfully.`);
            } else {
                await updateATM(selectedAtmId, payload);
                setActionNotice(`ATM "${payload.atmName}" updated successfully.`);
            }
            setShowModal(false);
            fetchATMs();
            setTimeout(() => setActionNotice(''), 4000);
        } catch (err) {
            setModalError(err.message || 'Operation failed');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete handlers
    const handleDeleteClick = (atm) => {
        setAtmToDelete(atm);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!atmToDelete) return;
        try {
            setDeleteLoading(true);
            await deleteATM(atmToDelete._id);
            setActionNotice(`ATM "${atmToDelete.atmName}" deleted successfully.`);
            setShowDeleteConfirm(false);
            setAtmToDelete(null);
            fetchATMs();
            setTimeout(() => setActionNotice(''), 4000);
        } catch (err) {
            setError(err.message || 'Failed to delete ATM');
            setShowDeleteConfirm(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Access Denied screen for non-admin users
    if (!isAdmin) {
        return (
            <div className="page-wrapper">
                <div className="glass-card admin-denied-card text-center">
                    <div className="admin-denied-icon">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <h2 className="admin-denied-title">Access Denied</h2>
                    <p className="admin-denied-text">
                        You do not have administrative privileges to access this page. Please return to the user dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary px-4 py-2"
                    >
                        Go to User Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Metric Calculations
    const totalATMs = atms.length;
    const activeATMs = atms.filter(a => a.status === 'active').length;
    const maintenanceATMs = atms.filter(a => a.status === 'maintenance').length;
    const inactiveATMs = atms.filter(a => a.status === 'inactive').length;

    return (
        <div className="admin-dashboard-container container py-4">

            {/* Page Header */}
            <div className="admin-header-row mb-4">
                <div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">
                        Manage and monitor all automated teller machines in real time
                    </p>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2"
                    onClick={handleAddClick}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add ATM
                </button>
            </div>

            {/* Action Notice Toast/Alert */}
            {actionNotice && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {actionNotice}
                </div>
            )}

            {/* Summary Cards Grid */}
            <div className="admin-stats-grid mb-4">

                {/* Total ATMs */}
                <div className="stat-card glass-card stat-total">
                    <div className="stat-card-header">
                        <span className="stat-label">Total ATMs</span>
                        <div className="stat-icon-wrapper icon-total">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value">{loading ? '...' : totalATMs}</div>
                    <div className="stat-footer text-muted">Registered in network</div>
                </div>

                {/* Active ATMs */}
                <div className="stat-card glass-card stat-active">
                    <div className="stat-card-header">
                        <span className="stat-label">Active ATMs</span>
                        <div className="stat-icon-wrapper icon-active">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value text-success">{loading ? '...' : activeATMs}</div>
                    <div className="stat-footer text-success">Operational & serving</div>
                </div>

                {/* Maintenance */}
                <div className="stat-card glass-card stat-maintenance">
                    <div className="stat-card-header">
                        <span className="stat-label">Maintenance</span>
                        <div className="stat-icon-wrapper icon-maintenance">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value text-warning">{loading ? '...' : maintenanceATMs}</div>
                    <div className="stat-footer text-warning">Under service/refill</div>
                </div>

                {/* Inactive */}
                <div className="stat-card glass-card stat-inactive">
                    <div className="stat-card-header">
                        <span className="stat-label">Inactive</span>
                        <div className="stat-icon-wrapper icon-inactive">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                    </div>
                    <div className="stat-value text-danger">{loading ? '...' : inactiveATMs}</div>
                    <div className="stat-footer text-danger">Out of order</div>
                </div>

            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ATM List Table Card */}
            <div className="glass-card table-card">
                <div className="table-card-header d-flex align-items-center justify-content-between p-3 border-bottom">
                    <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <span>ATM Locations</span>
                        <span className="badge bg-primary rounded-pill px-2.5 py-1">
                            {atms.length}
                        </span>
                    </h5>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={fetchATMs}
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh List'}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading ATMs...</span>
                        </div>
                        <p className="text-muted mt-2 mb-0">Fetching ATM data...</p>
                    </div>
                ) : atms.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <p className="mb-0">No ATMs found in the database.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle custom-atm-table mb-0">
                            <thead>
                                <tr>
                                    <th>ATM ID</th>
                                    <th>ATM & Bank Name</th>
                                    <th>Location Address</th>
                                    <th>Coordinates</th>
                                    <th>Status</th>
                                    <th>Cash Level</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atms.map((atm) => (
                                    <tr key={atm._id || atm.atmId}>
                                        <td>
                                            <span className="badge bg-light text-dark border font-monospace px-2 py-1">
                                                {atm.atmId}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">{atm.atmName}</div>
                                            <div className="text-muted small">{atm.bankName}</div>
                                        </td>
                                        <td>
                                            <div className="text-truncate max-w-address" title={atm.address}>
                                                {atm.address}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="small text-muted font-monospace">
                                                {atm.latitude?.toFixed(4)}, {atm.longitude?.toFixed(4)}
                                            </span>
                                        </td>
                                        <td>
                                            {atm.status === 'active' && (
                                                <span className="badge bg-success-atm rounded-pill px-3 py-1">
                                                    Active
                                                </span>
                                            )}
                                            {atm.status === 'maintenance' && (
                                                <span className="badge bg-warning-atm rounded-pill px-3 py-1">
                                                    Maintenance
                                                </span>
                                            )}
                                            {atm.status === 'inactive' && (
                                                <span className="badge bg-danger-atm rounded-pill px-3 py-1">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {atm.cashLevel === 'high' && (
                                                <span className="badge bg-success-atm rounded-pill px-2.5 py-1">
                                                    High
                                                </span>
                                            )}
                                            {atm.cashLevel === 'medium' && (
                                                <span className="badge bg-info-atm rounded-pill px-2.5 py-1">
                                                    Medium
                                                </span>
                                            )}
                                            {atm.cashLevel === 'low' && (
                                                <span className="badge bg-danger-atm rounded-pill px-2.5 py-1">
                                                    Low
                                                </span>
                                            )}
                                            {(!atm.cashLevel || atm.cashLevel === 'unknown') && (
                                                <span className="badge bg-light text-secondary border rounded-pill px-2.5 py-1">
                                                    Unknown
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2 action-btn"
                                                onClick={() => handleEditClick(atm)}
                                                title="Edit ATM"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger action-btn"
                                                onClick={() => handleDeleteClick(atm)}
                                                title="Delete ATM"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="atm-modal-card" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="atm-modal-header">
                            <h3 className="atm-modal-title">
                                {modalMode === 'create' ? 'Add New ATM' : `Edit ATM (${formData.atmId})`}
                            </h3>
                            <button
                                className="btn-close-custom"
                                onClick={() => setShowModal(false)}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleFormSubmit}>
                            <div className="atm-modal-body">

                                {modalError && (
                                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="2.5"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        {modalError}
                                    </div>
                                )}

                                <div className="atm-form-grid">

                                    {/* ATM ID */}
                                    <div className="form-group">
                                        <label htmlFor="atmId" className="form-label">ATM ID *</label>
                                        <input
                                            id="atmId"
                                            name="atmId"
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. ATM-101"
                                            value={formData.atmId}
                                            onChange={handleInputChange}
                                            disabled={modalMode === 'edit'} // ATM ID is unique identifier
                                            required
                                        />
                                    </div>

                                    {/* ATM Name */}
                                    <div className="form-group">
                                        <label htmlFor="atmName" className="form-label">ATM Name *</label>
                                        <input
                                            id="atmName"
                                            name="atmName"
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. Downtown Main ATM"
                                            value={formData.atmName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Bank Name */}
                                    <div className="form-group">
                                        <label htmlFor="bankName" className="form-label">Bank Name *</label>
                                        <input
                                            id="bankName"
                                            name="bankName"
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. National Bank"
                                            value={formData.bankName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="form-group">
                                        <label htmlFor="status" className="form-label">Status *</label>
                                        <select
                                            id="status"
                                            name="status"
                                            className="form-input"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>

                                    {/* Address (Full Span) */}
                                    <div className="form-group span-full">
                                        <label htmlFor="address" className="form-label">Address *</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g. 123 Main Street, Sector 5"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Latitude */}
                                    <div className="form-group">
                                        <label htmlFor="latitude" className="form-label">Latitude *</label>
                                        <input
                                            id="latitude"
                                            name="latitude"
                                            type="number"
                                            step="any"
                                            className="form-input"
                                            placeholder="e.g. 12.9716"
                                            value={formData.latitude}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Longitude */}
                                    <div className="form-group">
                                        <label htmlFor="longitude" className="form-label">Longitude *</label>
                                        <input
                                            id="longitude"
                                            name="longitude"
                                            type="number"
                                            step="any"
                                            className="form-input"
                                            placeholder="e.g. 77.5946"
                                            value={formData.longitude}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Cash Level (Full Span) */}
                                    <div className="form-group span-full">
                                        <label htmlFor="cashLevel" className="form-label">Cash Level *</label>
                                        <select
                                            id="cashLevel"
                                            name="cashLevel"
                                            className="form-input"
                                            value={formData.cashLevel}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                            <option value="unknown">Unknown</option>
                                        </select>
                                    </div>

                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="atm-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-3 py-2"
                                    onClick={() => setShowModal(false)}
                                    disabled={submitLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true" />
                                            Saving...
                                        </>
                                    ) : modalMode === 'create' ? 'Create ATM' : 'Update ATM'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Dialog Modal ── */}
            {showDeleteConfirm && atmToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="atm-modal-card delete-confirm-card text-center p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrapper">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </div>
                        <h4 className="fw-bold mb-2">Delete ATM Confirmation</h4>
                        <p className="text-muted mb-4">
                            Are you sure you want to delete this ATM?
                            <br />
                            <strong className="text-dark font-monospace">{atmToDelete.atmName} ({atmToDelete.atmId})</strong>
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <button
                                className="btn btn-outline-secondary px-4 py-2"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger px-4 py-2 d-flex align-items-center gap-2"
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm text-white" role="status" aria-hidden="true" />
                                        Deleting...
                                    </>
                                ) : 'Delete ATM'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
