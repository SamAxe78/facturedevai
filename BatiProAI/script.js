let recognition;
let isRecording=false;
let rawText="";
if('webkitSpeechRecognition'in window){recognition=new webkitSpeechRecognition();recognition.lang='fr-FR';recognition.continuous=false;recognition.interimResults=false;
recognition.onresult=e=>{rawText+= (rawText?'\n':'')+e.results[0][0].transcript;document.getElementById('output').textContent=rawText;};
recognition.onerror=e=>alert('Erreur reco: '+e.error);}else{alert('Navigateur non compatible (Chrome conseillé)');}

document.getElementById('recordBtn').onclick=()=>{if(!recognition)return;isRecording=!isRecording;
document.getElementById('recordBtn').textContent=isRecording?'⏹️ Stop':'🎤 Dicter un devis';
isRecording?recognition.start():recognition.stop();};

let lines=[]; // {desc,qty,unit,price,total}
function parseLine(line){
  let qty=1, price=0;
  let qtyMatch=line.match(/(\d+)\s*(?:x|fois|unites?|unit[eé]?s?)/i);
  if(qtyMatch)qty=parseInt(qtyMatch[1]);
  else{let startNum=line.match(/^\s*(\d+)\s+/);if(startNum)qty=parseInt(startNum[1]);}
  let priceMatch=line.match(/(\d+[\.,]?\d*)\s*(?:€|euros?)/i);
  if(priceMatch)price=parseFloat(priceMatch[1].replace(',','.'));
  // clean desc: remove numbers / euro words
  let desc=line.replace(/\d+\s*(?:x|fois|unites?|unit[eé]?s?)/gi,'')
               .replace(/\d+[\.,]?\d*\s*(?:€|euros?)/gi,'')
               .trim();
  desc=desc.charAt(0).toUpperCase()+desc.slice(1);
  let total=qty*price;
  return {desc,qty,unit:'u',price,total};
}

function renderTable(){
  let html='<table><tr><th>Désignation</th><th>Qté</th><th>Unité</th><th>PU HT</th><th>Total HT</th><th>Actions</th></tr>';
  let totalHT=0;
  lines.forEach((l,idx)=>{totalHT+=l.total;
    html+=`<tr><td>${l.desc}</td><td>${l.qty}</td><td>${l.unit}</td><td>${l.price.toFixed(2)}€</td><td>${l.total.toFixed(2)}€</td>
    <td class="actions"><button onclick="editLine(${idx})">✏️</button><button onclick="deleteLine(${idx})">🗑️</button></td></tr>`;
  });
  const tvaRate=parseFloat(document.getElementById('tva').value);
  const tva=totalHT*tvaRate;const ttc=totalHT+tva;
  html+='</table>';
  html+=`<p><strong>Total HT :</strong> ${totalHT.toFixed(2)} €</p>
  <p><strong>TVA (${tvaRate*100}%) :</strong> ${tva.toFixed(2)} €</p>
  <p><strong>Total TTC :</strong> ${ttc.toFixed(2)} €</p>`;
  document.getElementById('tableWrapper').innerHTML=html;
}

window.deleteLine=function(i){lines.splice(i,1);renderTable();}
window.editLine=function(i){
  const l=lines[i];
  const desc=prompt('Description',l.desc);if(desc===null)return;
  const qty=parseFloat(prompt('Quantité',l.qty));if(isNaN(qty))return;
  const price=parseFloat(prompt('Prix unitaire',l.price));if(isNaN(price))return;
  lines[i]={desc,qty,unit:'u',price,total:qty*price};renderTable();
}

document.getElementById('generateBtn').onclick=()=>{
  lines=[];
  rawText.split(/\n|,/).map(s=>s.trim()).filter(Boolean).forEach(s=>{lines.push(parseLine(s));});
  renderTable();
};
