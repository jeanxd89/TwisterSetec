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

const spinSound = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
const correctSound = new Tone.Synth().toDestination();
const errorSound = new Tone.Synth().toDestination();

const segments = [
  { color: "#e53935", label: "Ciência e Natureza", corNome: "Vermelho" },
  { color: "#43a047", label: "Geografia", corNome: "Verde" },
  { color: "#fdd835", label: "Arte e Cultura", corNome: "Amarelo" },
  { color: "#1e88e5", label: "Esportes e Entretenimento", corNome: "Azul" }
];

const segmentAngle = 360 / segments.length;
const radius = canvas.width / 2;
let currentRotation = 0;
let isSpinning = false;
let corSorteadaGlobal = "";

const partesDoCorpo = ["Mão Direita", "Mão Esquerda", "Pé Direito", "Pé Esquerdo"];

const questionBank = {
  "Ciência e Natureza": [
    { q: "Qual é o maior planeta do sistema solar?", a: ["Saturno", "Júpiter", "Terra"], correct: 1 },
    { q: "Quantos elementos tem a tabela periódica?", a: ["118", "92", "150"], correct: 0 },
    { q: "Qual é o metal líquido à temperatura ambiente?", a: ["Ferro", "Mercúrio", "Ouro"], correct: 1 },
    { q: "Que animal é conhecido como 'rei da selva'?", a: ["Tigre", "Leão", "Elefante"], correct: 1 },
    { q: "Qual é o processo das plantas produzirem alimento?", a: ["Respiração", "Fotossíntese", "Digestão"], correct: 1 },
    { q: "Quantos ossos tem o corpo humano adulto?", a: ["206", "300", "150"], correct: 0 },
    { q: "Qual é o maior mamífero terrestre?", a: ["Urso polar", "Elefante africano", "Girafa"], correct: 1 },
    { q: "Que gás é liberado pelas plantas durante a fotossíntese?", a: ["Dióxido de carbono", "Oxigênio", "Nitrogênio"], correct: 1 },
    { q: "Qual é o planeta mais próximo do Sol?", a: ["Vênus", "Terra", "Mercúrio"], correct: 2 },
    { q: "Que parte da célula é chamada de 'usina de energia'?", a: ["Núcleo", "Mitocôndria", "Ribossomo"], correct: 1 },
    { q: "Quantos litros de sangue tem o corpo humano adulto?", a: ["5-6 litros", "2-3 litros", "10-12 litros"], correct: 0 },
    { q: "Qual é o animal mais rápido do mundo?", a: ["Leopardo", "Guepardo", "Águia"], correct: 1 },
    { q: "Que planeta tem anéis visíveis?", a: ["Júpiter", "Saturno", "Urano"], correct: 1 }
  ],
  "Geografia": [
    { q: "Qual é o maior país do mundo em área territorial?", a: ["China", "Rússia", "Canadá"], correct: 1 },
    { q: "Qual é o rio mais longo do mundo?", a: ["Amazonas", "Nilo", "Yangtzé"], correct: 0 },
    { q: "Em qual continente fica o Deserto do Saara?", a: ["Ásia", "África", "América do Sul"], correct: 1 },
    { q: "Qual é a capital da Austrália?", a: ["Sydney", "Melbourne", "Canberra"], correct: 2 },
    { q: "Quantos estados tem o Brasil?", a: ["26", "27", "25"], correct: 1 },
    { q: "Qual é a montanha mais alta do mundo?", a: ["K2", "Monte Everest", "Mont Blanc"], correct: 1 },
    { q: "Qual país tem formato de bota?", a: ["França", "Itália", "Espanha"], correct: 1 },
    { q: "Qual é o menor país do mundo?", a: ["Mônaco", "Vaticano", "San Marino"], correct: 1 },
    { q: "Qual é o maior oceano do mundo?", a: ["Atlântico", "Índico", "Pacífico"], correct: 2 },
    { q: "Que cidade é conhecida como 'Big Apple'?", a: ["Los Angeles", "Nova York", "Chicago"], correct: 1 },
    { q: "Qual é a capital do Canadá?", a: ["Toronto", "Vancouver", "Ottawa"], correct: 2 },
    { q: "Em que continente fica o Egito?", a: ["Ásia", "África", "Europa"], correct: 1 }
  ],
  "Arte e Cultura": [
    { q: "Quem pintou 'A Noite Estrelada'?", a: ["Picasso", "Van Gogh", "Monet"], correct: 1 },
    { q: "Qual instrumento musical tem 88 teclas?", a: ["Violino", "Piano", "Harpa"], correct: 1 },
    { q: "Quem escreveu 'Dom Quixote'?", a: ["Miguel de Cervantes", "William Shakespeare", "Machado de Assis"], correct: 0 },
    { q: "Qual é a sétima arte?", a: ["Pintura", "Cinema", "Música"], correct: 1 },
    { q: "Quem compôs 'Para Elisa'?", a: ["Mozart", "Beethoven", "Bach"], correct: 1 },
    { q: "Qual destes é um estilo de dança brasileira?", a: ["Flamenco", "Samba", "Tango"], correct: 1 },
    { q: "Quem escreveu 'Romeu e Julieta'?", a: ["Charles Dickens", "William Shakespeare", "Jane Austen"], correct: 1 },
    { q: "Qual pintor cortou a própria orelha?", a: ["Picasso", "Van Gogh", "Monet"], correct: 1 },
    { q: "Qual é o museu mais visitado do mundo?", a: ["British Museum", "Louvre", "Metropolitan"], correct: 1 },
    { q: "Que obra tem o personagem Hamlet?", a: ["Macbeth", "Hamlet", "Otelo"], correct: 1 },
    { q: "Qual destes é um instrumento de sopro?", a: ["Violoncelo", "Flauta", "Guitarra"], correct: 1 },
    { q: "Em que país nasceu o tango?", a: ["Brasil", "Argentina", "México"], correct: 1 }
  ],
  "Esportes e Entretenimento": [
    { q: "Quantos jogadores tem um time de vôlei?", a: ["5 jogadores", "6 jogadores", "7 jogadores"], correct: 1 },
    { q: "Que esporte é conhecido como 'rei dos esportes'?", a: ["Futebol", "Basquete", "Tênis"], correct: 0 },
    { q: "Qual filme ganhou o Oscar de Melhor Filme em 2020?", a: ["Parasita", "1917", "Coringa"], correct: 0 },
    { q: "Quantos rounds tem uma luta de boxe profissional?", a: ["10 rounds", "12 rounds", "15 rounds"], correct: 1 },
    { q: "Que atriz interpretou Hermione em Harry Potter?", a: ["Emma Stone", "Emma Watson", "Emma Roberts"], correct: 1 },
    { q: "Qual é o esporte mais popular do mundo?", a: ["Basquete", "Futebol", "Críquete"], correct: 1 },
    { q: "Quantos anéis tem o símbolo olímpico?", a: ["4", "5", "6"], correct: 1 },
    { q: "Que série tem as casas Stark e Lannister?", a: ["The Witcher", "Game of Thrones", "Vikings"], correct: 1 },
    { q: "Qual nadador ganhou mais medalhas olímpicas?", a: ["Michael Phelps", "Mark Spitz", "Ian Thorpe"], correct: 0 },
    { q: "Que filme tem o personagem Tony Stark?", a: ["Homem-Aranha", "Homem de Ferro", "Capitão América"], correct: 1 },
    { q: "Quantos jogadores tem um time de basquete em quadra?", a: ["5", "6", "7"], correct: 0 },
    { q: "Qual cantora é conhecida como 'Rainha do Pop'?", a: ["Beyoncé", "Madonna", "Lady Gaga"], correct: 1 }
  ]
};

let availableQuestions = JSON.parse(JSON.stringify(questionBank));
let acertosCount = 0;
let perguntasTotal = 10;
let questionsAnswered = 0;
let currentQuestion = null;

// --- DESENHA A ROLETA ---
function desenharRoleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = radius, centerY = radius;

  segments.forEach((segment, i) => {
    const start = (i * segmentAngle * Math.PI) / 180;
    const end = ((i + 1) * segmentAngle * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 5, start, end);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    // texto centralizado
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(start + (end - start) / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Poppins";
    ctx.fillText(segment.corNome, radius - 20, 5);
    ctx.restore();
  });
}

function girarRoleta() {
  if (isSpinning) return;

  Tone.start();
  spinSound.triggerAttackRelease("8n");

  isSpinning = true;
  botaoGirar.disabled = true;
  btnProxima.disabled = true;
  perguntaContainer.style.display = "none";
  resultado.textContent = "Girando...";

  const randomSpin = 720 + Math.random() * 1080;
  const targetRotation = currentRotation + randomSpin;

  canvas.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
  canvas.style.transform = `rotate(${targetRotation}deg)`;

  canvas.addEventListener("transitionend", () => {
    currentRotation = targetRotation % 360;
    onSpinEnd();
  }, { once: true });
}

function onSpinEnd() {
  isSpinning = false;

  const finalAngle = (270 - currentRotation + 360) % 360;
  const index = Math.floor(finalAngle / segmentAngle);
  const seg = segments[index];

  corSorteadaGlobal = seg.corNome;
  resultado.textContent = `Cor: ${seg.corNome}!`;

  mostrarPergunta(seg.label);
}

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

btnRegras.addEventListener("click", () => modalRegras.style.display = "flex");
btnFecharModal.addEventListener("click", () => modalRegras.style.display = "none");
modalRegras.addEventListener("click", e => { if (e.target === modalRegras) modalRegras.style.display = "none"; });

botaoGirar.addEventListener("click", girarRoleta);
btnProxima.addEventListener("click", proximaRodada);

desenharRoleta();
updateInfo();





