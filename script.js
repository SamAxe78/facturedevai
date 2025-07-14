const output = document.getElementById("output");
const generateBtn = document.getElementById("generateBtn");
const recordBtn = document.getElementById("recordBtn");
const devisTable = document.getElementById("devisTable");
const tvaSelect = document.getElementById("tvaSelect");

let devis = [];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseSpeech(text) {
    const items = [];
    const regex = /(\d+)\s*(.*?)\s*[àa]?\s*(\d+(?:[\.,]\d+)?)\s*(euros|€)?\s*(pi[eè]ce|chacun|unité)?/gi;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const qt = parseInt(match[1]);
        const designation = capitalize(match[2].trim());
        const pu = parseFloat(match[3].replace(',', '.'));
        const total = +(qt * pu).toFixed(2);
        items.push({ qt, designation, pu, total });
    }
    return items;
}

function updateTable() {
    if (!devis.length) return;
    let tvaRate = parseFloat(tvaSelect.value);
    let html = "<table><tr><th>Qt</th><th>Désignation</th><th>PU HT</th><th>Total HT</th><th>Action</th></tr>";
    let totalHT = 0;

    devis.forEach((item, index) => {
        html += `<tr>
            <td>${item.qt}</td>
            <td>${item.designation}</td>
            <td>${item.pu.toFixed(2)} €</td>
            <td>${item.total.toFixed(2)} €</td>
            <td><button onclick="removeLine(${index})">❌</button></td>
        </tr>`;
        totalHT += item.total;
    });

    const tva = +(totalHT * tvaRate).toFixed(2);
    const ttc = +(totalHT + tva).toFixed(2);

    html += `</table>
        <p>Total HT : ${totalHT.toFixed(2)} €</p>
        <p>TVA (${(tvaRate * 100).toFixed(0)}%) : ${tva.toFixed(2)} €</p>
        <p><strong>Total TTC : ${ttc.toFixed(2)} €</strong></p>`;

    devisTable.innerHTML = html;
}

function removeLine(index) {
    devis.splice(index, 1);
    updateTable();
}

function processDictation(text) {
    const items = parseSpeech(text);
    devis = devis.concat(items);
    updateTable();
}

recordBtn.addEventListener("click", () => {
    if (!("webkitSpeechRecognition" in window)) {
        const fakeText = prompt("Simuler une dictée (ex: 2 prises électriques à 30 euros pièce)");
        if (fakeText) processDictation(fakeText);
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        output.textContent += transcript + "\n";
        processDictation(transcript);
    };

    recognition.onerror = (e) => alert("Erreur reconnaissance vocale : " + e.error);
    recognition.start();
});

generateBtn.addEventListener("click", () => updateTable());