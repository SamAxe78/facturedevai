let isRecording = false;
let recognition;
let transcription = "";

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "fr-FR";

    recognition.onresult = function(event) {
        const lastResult = event.results[event.results.length - 1][0].transcript;
        transcription += lastResult + ". ";
        document.getElementById("output").textContent = transcription;
    };

    recognition.onerror = function(event) {
        alert("Erreur lors de la reconnaissance vocale : " + event.error);
    };
}

document.getElementById("recordBtn").addEventListener("click", () => {
    if (!recognition) return alert("Reconnaissance vocale non supportée");

    if (!isRecording) {
        transcription += ""; // Ne rien effacer
        recognition.start();
        isRecording = true;
        document.getElementById("recordBtn").textContent = "⏹️ Arrêter l'enregistrement";
    } else {
        recognition.stop();
        isRecording = false;
        document.getElementById("recordBtn").textContent = "🎤 Dicter un devis";
    }
});

document.getElementById("generateBtn").addEventListener("click", () => {
    const lines = transcription.split(".").map(line => line.trim()).filter(Boolean);
    let tableHTML = "<table><tr><th>Description</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>Total HT</th></tr>";
    let totalHT = 0;

    lines.forEach((line, i) => {
        const pu = 100;  // Prix unitaire fictif
        const qty = 1;
        const total = qty * pu;
        totalHT += total;
        tableHTML += `<tr><td>${line}</td><td>${qty}</td><td>u</td><td>${pu}€</td><td>${total}€</td></tr>`;
    });

    const tvaRate = parseFloat(document.getElementById("tvaSelect").value);
    const tvaAmount = totalHT * tvaRate;
    const totalTTC = totalHT + tvaAmount;

    tableHTML += `</table>
        <p>Total HT : ${totalHT.toFixed(2)} €</p>
        <p>TVA (${tvaRate * 100}%) : ${tvaAmount.toFixed(2)} €</p>
        <p><strong>Total TTC : ${totalTTC.toFixed(2)} €</strong></p>`;

    document.getElementById("devisTable").innerHTML = tableHTML;
});