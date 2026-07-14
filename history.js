import { apiFetch, API_BASE } from './api.js';
import { escapeHtml } from './ui-utils.js';

export function openHistoryDashboard() {
    const historyDashboard = document.getElementById("historyDashboard");
    const checkerDashboard = document.getElementById("checkerDashboard");
    if (!historyDashboard || !checkerDashboard) return;
    checkerDashboard.style.display = "none";
    historyDashboard.style.display = "block";
    loadHistory();
}

export function closeHistoryDashboard() {
    const historyDashboard = document.getElementById("historyDashboard");
    const checkerDashboard = document.getElementById("checkerDashboard");
    if (!historyDashboard || !checkerDashboard) return;
    historyDashboard.style.display = "none";
    checkerDashboard.style.display = "block";
}

export function renderHistory(items) {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    if (!items || items.length === 0) {
        historyList.innerHTML = `<p class="history-empty">No searches yet.</p>`;
        return;
    }

    let html = "";

    items.forEach((item) => {
        const typeLabel = item.searchType === "image" ? "Image" : "Text";
        const query = escapeHtml(item.query || "").slice(0, 160);
        const reply = escapeHtml(item.reply || "").slice(0, 260);
        const createdAt = new Date(item.createdAt).toLocaleString();

        html += `
            <div class="history-item">
                <div class="history-meta">
                    <span class="history-type">${typeLabel}</span>
                    <span class="history-time">${createdAt}</span>
                </div>
                <p><strong>Search:</strong> ${query}</p>
                <p><strong>Result:</strong> ${reply}</p>
            </div>
        `;
    });

    historyList.innerHTML = html;
}

export async function loadHistory() {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    const requestToken = localStorage.getItem("authToken");
    if (!requestToken) {
        historyList.innerHTML = `<p class="history-empty">Login to view previous searches.</p>`;
        return;
    }

    historyList.innerHTML = `<p class="history-empty">Loading history...</p>`;

    try {
        const res = await apiFetch(`${API_BASE}/history`);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Could not load history");
        }

        if (localStorage.getItem("authToken") !== requestToken) return;
        renderHistory(data.history || []);
    } catch (_err) {
        if (localStorage.getItem("authToken") !== requestToken) return;
        historyList.innerHTML = `<p class="history-empty">Unable to load history.</p>`;
    }
}
