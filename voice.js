export let recognition;
export let finalTranscript = "";

export function startVoice(lang) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Use Google Chrome for voice input");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    finalTranscript = "";

    const loading = document.getElementById("loading");

    recognition.start();

    if (loading) {
        loading.style.display = "block";
        loading.innerText = lang === "hi-IN" ? "सुन रहा है... 🎤" : "Listening... 🎤";
    }

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        finalTranscript = transcript;
        document.getElementById("symptoms").value = finalTranscript;
        if (loading) loading.style.display = "none";
    };

    recognition.onerror = function (event) {
        if (loading) loading.style.display = "none";
        console.log(event.error);
        if (event.error === "not-allowed") {
            alert("Please allow microphone access");
        } else {
            alert("Voice error: " + event.error);
        }
    };

    recognition.onend = function () {
        if (loading) loading.style.display = "none";
        console.log("Voice recognition stopped");
    };
}

export function stopVoice() {
    if (recognition) {
        recognition.stop();
        const loading = document.getElementById("loading");
        if (loading) loading.style.display = "none";
        console.log("Stopped listening");
    }
}
