const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};

// Google Login
export const googleLoginUser = async (credential) => {
    const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Google login failed");
    }

    return data;
};

// Fetch all ATMs
export const getATMs = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/atms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch ATMs");
    }

    return data;
};

// Create new ATM
export const createATM = async (atmData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/atms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(atmData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create ATM");
    }

    return data;
};

// Update ATM
export const updateATM = async (id, atmData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/atms/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(atmData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update ATM");
    }

    return data;
};

// Delete ATM
export const deleteATM = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/atms/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete ATM");
    }

    return data;
};

