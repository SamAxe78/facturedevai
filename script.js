
let recording = false;
let finalTranscript = "";

document.getElementById("recordBtn").onclick = async () => {
    if (!recording) {
        recording = true;
        document.getElementById("recordBtn").innerText = "⏹️ Stop";
        finalTranscript += " [dictée en cours...]";
        document.getElementById("output").innerText = finalTranscript;
        // Simulation de dictée
        setTimeout(() => {
            const simulated = "Remplacement robinet avec mitigeur, pose lavabo 1 unité 120 euros";
            finalTranscript = finalTranscript.replace(" [dictée en cours...]", "") + "\n" + simulated;
            document.getElementById("output").innerText = finalTranscript;
            document.getElementById("recordBtn").innerText = "🎤 Dicter un devis";
            recording = false;
        }, 3000);
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
