export function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export function showLoading(text = "") {
    const loading = document.getElementById("loading");
    if (!loading) return;
    loading.style.display = "block";
    loading.innerText = text || loading.innerText;
}

export function hideLoading() {
    const loading = document.getElementById("loading");
    if (!loading) return;
    loading.style.display = "none";
}
