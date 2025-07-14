
document.getElementById('recordBtn').addEventListener('click', () => {
    const output = document.getElementById('output');
    const text = prompt("Simuler une dictée (ex: 2 prises électriques à 30 euros pièce)");
    if (text) {
        output.textContent += text + "\n";
    }
});

document.getElementById('generateBtn').addEventListener('click', () => {
    const output = document.getElementById('output').textContent.trim();
    if (!output) return;

    const lines = output.split('\n');
    const tvaRate = parseFloat(document.getElementById('tvaSelect').value);
    let totalHT = 0;
    let tableHTML = '<table><tr><th>Désignation</th><th>Qté</th><th>PU HT</th><th>Total HT</th><th>Actions</th></tr>';

    lines.forEach((line, index) => {
        let qte = 1, pu = 1;
        const qtMatch = line.match(/(\d+)\s*(?=prise|ampoule|robinet|tuyau|wc|toilette|unité|unité)/i);
        const puMatch = line.match(/(\d+[,.]?\d*)\s*(€|euros?)/i);
        if (qtMatch) qte = parseInt(qtMatch[1]);
        if (puMatch) pu = parseFloat(puMatch[1].replace(',', '.'));

        const total = qte * pu;
        totalHT += total;

        const designation = line.charAt(0).toUpperCase() + line.slice(1).replace(/\s+à.*$/, '');
        tableHTML += `<tr>
            <td>${designation}</td>
            <td>${qte}</td>
            <td>${pu.toFixed(2)}€</td>
            <td>${total.toFixed(2)}€</td>
            <td class="actions">
                <button onclick="editLine(${index})">✏️</button>
                <button onclick="deleteLine(${index})">🗑️</button>
            </td>
        </tr>`;
    });

    const tva = totalHT * tvaRate;
    const ttc = totalHT + tva;
    tableHTML += `</table><p>Total HT : ${totalHT.toFixed(2)}€<br>TVA : ${tva.toFixed(2)}€<br>Total TTC : ${ttc.toFixed(2)}€</p>`;
    document.getElementById('devisTable').innerHTML = tableHTML;
});

function deleteLine(index) {
    const lines = document.getElementById('output').textContent.trim().split('\n');
    lines.splice(index, 1);
    document.getElementById('output').textContent = lines.join('\n') + '\n';
}

function editLine(index) {
    const lines = document.getElementById('output').textContent.trim().split('\n');
    const newText = prompt("Modifier la ligne :", lines[index]);
    if (newText !== null) {
        lines[index] = newText;
        document.getElementById('output').textContent = lines.join('\n') + '\n';
    }
}
