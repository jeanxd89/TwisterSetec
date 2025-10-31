 // --- Seletores do DOM ---
const canvas = document.getElementById("roletaCanvas");
const ctx = canvas.getContext("2d");
const botaoGirar = document.getElementById("botaoGirar");
const btnProxima = document.getElementById("btnProxima");
const resultado = document.getElementById("resultado");
const perguntaContainer = document.getElementById("perguntaContainer");
const textoPergunta = document.getElementById("textoPergunta");
const alternativas = document.getElementById("alternativas");
const acertosEl = document.getElementById("acertos");
const perguntasRestantesEl = document.getElementById("perguntasRestantes");

const btnRegras = document.getElementById("btnRegras");
const modalRegras = document.getElementById("modalRegras");
const btnFecharModal = document.getElementById("btnFecharModal");

// --- Sons ---
const spinSound = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
const clickSound = new Tone.MembraneSynth().toDestination(); // som dos "cliques" da roleta
const correctSound = new Tone.Synth().toDestination();
const errorSound = new Tone.Synth().toDestination();

// --- Configuração da Roleta ---
const segments = [
  { color: "#FF1744", label: "Ciência e Natureza", corNome: "Vermelho" },
  { color: "#00E676", label: "Geografia", corNome: "Verde" },
  { color: "#FFEA00", label: "Arte e Cultura", corNome: "Amarelo" },
  { color: "#2979FF", label: "Esportes e Entretenimento", corNome: "Azul" }
];

const segmentAngle = 360 / segments.length;
const radius = canvas.width / 2;
let currentRotation = 0;
let isSpinning = false;
let corSorteadaGlobal = "";
let roletaBrilho = 0;

// --- Perguntas e partes do corpo ---
const partesDoCorpo = ["Mão Direita", "Mão Esquerda", "Pé Direito", "Pé Esquerdo"];
const questionBank = {
  "Ciência e Natureza": [
    { q: "Qual planeta é conhecido como 'Planeta Vermelho'?", a: ["Júpiter", "Marte", "Vênus"], correct: 1 },
    { q: "Qual é o símbolo químico da água?", a: ["H2O", "CO2", "O2"], correct: 0 },
  ],
  "Geografia": [
    { q: "Qual é o maior continente do mundo?", a: ["Ásia", "África", "América"], correct: 0 },
    { q: "Onde fica a Torre Eiffel?", a: ["Londres", "Berlim", "Paris"], correct: 2 },
  ],
  "Arte e Cultura": [
    { q: "Quem pintou a 'Mona Lisa'?", a: ["Michelangelo", "Leonardo da Vinci", "Donatello"], correct: 1 },
  ],
  "Esportes e Entretenimento": [
    { q: "Quem é conhecido como 'O Rei do Futebol'?", a: ["Maradona", "Messi", "Pelé"], correct: 2 },
  ]
};

let availableQuestions = JSON.parse(JSON.stringify(questionBank));
let acertosCount = 0;
let perguntasTotal = 10;
let questionsAnswered = 0;
let currentQuestion = null;

// --- Desenho da Roleta com Brilho ---
function desenharRoleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = radius, centerY = radius;

  segments.forEach((segment, i) => {
    const start = (i * segmentAngle * Math.PI) / 180;
    const end = ((i + 1) * segmentAngle * Math.PI) / 180;

    const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    grad.addColorStop(0, "#fff3");
    grad.addColorStop(1, segment.color);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 5, start, end);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(start + (end - start) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Poppins";
    ctx.fillText(segment.corNome, radius - 20, 5);
    ctx.restore();
  });

  // Brilho girando
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 10, (roletaBrilho * Math.PI) / 180, ((roletaBrilho + 80) * Math.PI) / 180);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.stroke();
  ctx.restore();

  roletaBrilho += 3;
  if (roletaBrilho > 360) roletaBrilho = 0;

  requestAnimationFrame(desenharRoleta);
}

// --- Gira a roleta com aceleração, desaceleração e cliques ---
function girarRoleta() {
  if (isSpinning) return;

  Tone.start();
  spinSound.triggerAttackRelease("8n");
  isSpinning = true;

  botaoGirar.disabled = true;
  btnProxima.disabled = true;
  perguntaContainer.style.display = "none";
  resultado.textContent = "Girando...";

  let velocidade = 0;
  let velocidadeMax = 25 + Math.random() * 15;
  let desacelerando = false;
  let angulo = currentRotation;
  let ultimoClique = 0;

  const animarGiro = () => {
    if (!desacelerando) {
      velocidade += 0.6;
      if (velocidade >= velocidadeMax) desacelerando = true;
    } else {
      velocidade *= 0.985;
      if (velocidade < 0.3) {
        finalizarGiro(angulo);
        return;
      }
    }

    angulo += velocidade;
    currentRotation = angulo % 360;
    canvas.style.transform = `rotate(${angulo}deg)`;

    // Clique sonoro por setor
    if (Math.abs(angulo - ultimoClique) >= segmentAngle / 2) {
      clickSound.triggerAttackRelease("C3", "32n");
      ultimoClique = angulo;
    }

    requestAnimationFrame(animarGiro);
  };

  animarGiro();
}

// --- Finaliza o giro e escolhe a categoria ---
function finalizarGiro(anguloFinal) {
  isSpinning = false;
  const finalAngle = (270 - anguloFinal + 360) % 360;
  const index = Math.floor(finalAngle / segmentAngle);
  const seg = segments[index];

  corSorteadaGlobal = seg.corNome;
  resultado.textContent = `Cor: ${seg.corNome}!`;
  mostrarPergunta(seg.label);
}

// --- Lógica do Quiz ---
function mostrarPergunta(cat) {
  const perguntas = availableQuestions[cat];
  if (!perguntas || perguntas.length === 0) {
    resultado.textContent = `Sem mais perguntas em ${cat}. Gire novamente.`;
    botaoGirar.disabled = false;
    return;
  }

  currentQuestion = perguntas.shift();
  textoPergunta.textContent = currentQuestion.q;
  alternativas.innerHTML = "";

  currentQuestion.a.forEach((alt, i) => {
    const el = document.createElement("div");
    el.classList.add("alternativa");
    el.textContent = alt;
    el.dataset.index = i;
    el.addEventListener("click", verificarResposta);
    alternativas.appendChild(el);
  });

  perguntaContainer.style.display = "block";
}

function verificarResposta(e) {
  const idx = parseInt(e.target.dataset.index);
  const all = alternativas.querySelectorAll(".alternativa");
  all.forEach(b => b.classList.add("disabled"));

  if (idx === currentQuestion.correct) {
    e.target.classList.add("correct");
    correctSound.triggerAttackRelease("C5", "8n");
    acertosCount++;

    const parte = partesDoCorpo[Math.floor(Math.random() * partesDoCorpo.length)];
    resultado.textContent = `✅ ACERTOU! ${parte} no ${corSorteadaGlobal}!`;
  } else {
    e.target.classList.add("incorrect");
    all[currentQuestion.correct].classList.add("correct");
    errorSound.triggerAttackRelease("A2", "8n");
    resultado.textContent = "❌ ERROU! Está salvo nesta rodada.";
  }

  questionsAnswered++;
  updateInfo();

  if (questionsAnswered < perguntasTotal) {
    btnProxima.disabled = false;
  } else {
    fimDeJogo();
  }
}

function updateInfo() {
  acertosEl.textContent = `Pontos: ${acertosCount} ✅`;
  perguntasRestantesEl.textContent = `Jogadas restantes: ${perguntasTotal - questionsAnswered}`;
}

function proximaRodada() {
  perguntaContainer.style.display = "none";
  btnProxima.disabled = true;
  botaoGirar.disabled = false;
  resultado.textContent = "Gire a roleta para a próxima jogada!";
}

function fimDeJogo() {
  resultado.textContent = `🏁 Fim de jogo! Pontos: ${acertosCount} / ${perguntasTotal}`;
  botaoGirar.disabled = true;
  btnProxima.disabled = true;
}

// --- Modal ---
btnRegras.addEventListener("click", () => modalRegras.style.display = "flex");
btnFecharModal.addEventListener("click", () => modalRegras.style.display = "none");
modalRegras.addEventListener("click", e => { if (e.target === modalRegras) modalRegras.style.display = "none"; });

// --- Inicialização ---
botaoGirar.addEventListener("click", girarRoleta);
btnProxima.addEventListener("click", proximaRodada);
desenharRoleta();
updateInfo();








