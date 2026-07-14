import { apiFetch, API_BASE } from './api.js';
import { translateToEnglish } from './translate.js';
import { showLoading, hideLoading } from './ui-utils.js';

export async function analyze() {
    let text = document.getElementById("symptoms").value;

    if (text.trim() === "") {
        alert("Enter symptoms");
        return;
    }

    if (text.length < 4) {
        alert("Please enter meaningful symptoms");
        return;
    }

    showLoading("Analyzing...");

    const hindiRegex = /[\u0900-\u097F]/;

    if (hindiRegex.test(text)) {
        text = await translateToEnglish(text);
    }

    showLoading("Analyzing...");

    try {
        const res = await apiFetch(`${API_BASE}/analyze-text`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms: text })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Request failed");

        showResult(data.reply);
        if (window.loadHistory) await window.loadHistory();
    } catch (err) {
        console.log(err);
        showResult("Error connecting to server");
    } finally {
        hideLoading();
    }
}

export async function analyzeImage() {
    const fileInput = document.getElementById("photo");
    if (fileInput.files.length === 0) {
        alert("Upload image");
        return;
    }

    showLoading("Analyzing image...");

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        const res = await apiFetch(`${API_BASE}/analyze-image`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Image analysis failed");

        showResult(data.reply);
        if (window.loadHistory) await window.loadHistory();
    } catch (err) {
        console.log(err);
        showResult("Image analysis failed");
    } finally {
        hideLoading();
    }
}

export function showResult(text) {
    hideLoading();

    const box = document.getElementById("resultBox");
    if (!box) return;
    box.style.display = "block";

    const points = text.split(/\d+\./).filter(point => point.trim() !== "");

    let html = "";

    points.forEach((point, index) => {
        html += `
            <div class="result-card">
                <h4>Point ${index + 1}</h4>
                <p>${point.trim()}</p>
            </div>
        `;
    });

    document.getElementById("resultText").innerHTML = html;
}
