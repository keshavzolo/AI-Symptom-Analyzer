import { API_BASE } from './api.js';

export function showSignupBox() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "flex";
}

export function showLoginBox() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "flex";
}

export function setAuthView(isAuthenticated, username = "") {
    const authSection = document.getElementById("authSection");
    const appSection = document.getElementById("appSection");
    const loggedInUser = document.getElementById("loggedInUser");

    if (!authSection || !appSection) return;

    authSection.style.display = isAuthenticated ? "none" : "flex";
    appSection.style.display = isAuthenticated ? "block" : "none";

    if (isAuthenticated) {
        if (window.closeHistoryDashboard) window.closeHistoryDashboard();
        resetDashboardState(true);
        loggedInUser.innerText = `Logged in as ${username}`;
    } else {
        loggedInUser.innerText = "";
        if (window.closeHistoryDashboard) window.closeHistoryDashboard();
        resetDashboardState(false);
        const historyList = document.getElementById("historyList");
        if (historyList) {
            historyList.innerHTML = `<p class="history-empty">Login to view previous searches.</p>`;
        }
    }
}

export function resetDashboardState(isAuthenticated = false) {
    const symptoms = document.getElementById("symptoms");
    const photo = document.getElementById("photo");
    const preview = document.getElementById("preview");
    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");
    const historyList = document.getElementById("historyList");

    if (symptoms) symptoms.value = "";
    if (photo) photo.value = "";
    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }
    if (resultBox) resultBox.style.display = "none";
    if (resultText) resultText.innerHTML = "";
    if (historyList) {
        historyList.innerHTML = isAuthenticated
            ? `<p class="history-empty">No searches yet.</p>`
            : `<p class="history-empty">Login to view previous searches.</p>`;
    }
}

export async function login() {
    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter both username and password to login.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", data.username);
        setAuthView(true, data.username);
    } catch (err) {
        alert(err.message || "Login failed");
    }
}

export async function signup() {
    const usernameInput = document.getElementById("signupUsername");
    const passwordInput = document.getElementById("signupPassword");
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        alert("Please enter both username and password to signup.");
        return;
    }

    if (username.length < 3) {
        alert("Username must be at least 3 characters.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Signup failed");
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", data.username);
        setAuthView(true, data.username);
        showLoginBox();
    } catch (err) {
        alert(err.message || "Signup failed");
    }
}

export async function logout() {
    try {
        await fetch(`${API_BASE}/logout`, { method: "POST" });
    } catch (err) {
        console.log(err);
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setAuthView(false);
}

export async function checkAuthOnLoad() {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser") || "";

    if (!token) {
        setAuthView(false);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAuthView(true, data.username || savedUser);
    } catch (_err) {
        setAuthView(false);
    }
}


