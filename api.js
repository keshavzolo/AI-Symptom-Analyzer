export const API_BASE = process.env.API_BASE;

export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("authToken");
    const headers = options.headers || {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        if (window.setAuthView) window.setAuthView(false);
        throw new Error("Unauthorized");
    }

    return response;
}
