export async function downloadPDF() {
    const result = document.getElementById("resultText").innerText;
    const symptoms = document.getElementById("symptoms").value;

    if (!result) {
        alert("No report available");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("AI Medical Report", 20, 20);

    const date = new Date().toLocaleString();
    doc.setFontSize(11);
    doc.text("Generated: " + date, 20, 30);

    doc.setFontSize(14);
    doc.text("Symptoms:", 20, 45);

    doc.setFontSize(12);
    const symptomLines = doc.splitTextToSize(symptoms, 170);
    doc.text(symptomLines, 20, 55);

    let y = 65 + symptomLines.length * 7;
    doc.setFontSize(14);
    doc.text("AI Assessment:", 20, y);
    doc.setFontSize(12);
    const resultLines = doc.splitTextToSize(result, 170);
    doc.text(resultLines, 20, y + 10);

    let finalY = y + 20 + resultLines.length * 7;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
        "Disclaimer: This AI analysis is for educational purposes only and is not professional medical advice.",
        20,
        finalY,
        { maxWidth: 170 }
    );

    doc.save("Medical_Report.pdf");
}
