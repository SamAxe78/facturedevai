let recognition;
let finalTranscript = "";
let recording = false;

if (!('webkitSpeechRecognition' in window)) {
    alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Utilise Google Chrome.");
} else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "fr-FR";

    recognition.onstart = () => {
        console.log("🎙️ Enregistrement...");
    };

    recognition.onerror = (event) => {
        console.error("Erreur reco:", event.error);
    };

    recognition.onend = () => {
        recording = false;
        document.getElementById("recordBtn").innerText = "🎤 Dicter un devis";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        finalTranscript += (finalTranscript ? "\n" : "") + transcript;
        document.getElementById("output").innerText = finalTranscript;
    };
}

document.getElementById("recordBtn").onclick = () => {
    if (!recording) {
        recording = true;
        document.getElementById("recordBtn").innerText = "⏹️ Stop";
        recognition.start();
    } else {
        recognition.stop();
        recording = false;
        document.getElementById("recordBtn").innerText = "🎤 Dicter un devis";
    }
};

document.getElementById("generateBtn").onclick = () => {
    const text = finalTranscript;
    if (!text.trim()) return;

    const items = text.split(",").map(item => {
        return {
            designation: item.trim(),
            quantite: 1,
            unite: "u",
            prix: 100,
            total: 100
        };
    });

    let html = "<table border='1'><tr><th>Désignation</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>Total HT</th></tr>";
    items.forEach(i => {
        html += `<tr><td>${i.designation}</td><td>${i.quantite}</td><td>${i.unite}</td><td>${i.prix}</td><td>${i.total}</td></tr>`;
    });
    html += "</table>";

    document.getElementById("devisTable").innerHTML = html;
};
