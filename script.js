// --- Referências do DOM ---
const canvas = document.getElementById('roletaCanvas');
const ctx = canvas.getContext('2d');
const botaoGirar = document.getElementById('botaoGirar');
const btnProxima = document.getElementById('btnProxima');
const resultado = document.getElementById('resultado');
const perguntaContainer = document.getElementById('perguntaContainer');
const textoPergunta = document.getElementById('textoPergunta');
const alternativas = document.getElementById('alternativas');
const acertosEl = document.getElementById('acertos');
const perguntasRestantesEl = document.getElementById('perguntasRestantes');

// --- Referências do Modal ---
const btnRegras = document.getElementById('btnRegras');
const modalRegras = document.getElementById('modalRegras');
const btnFecharModal = document.getElementById('btnFecharModal');

// --- Configurações dos Sons (Tone.js) ---
const spinSound = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 } }).toDestination();
const correctSound = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 } }).toDestination();
correctSound.volume.value = -10;
const errorSound = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination();
errorSound.volume.value = -10;

// --- Configurações da Roleta ---
const segments = [
  { color: '#FF0000', label: 'Ciência e Natureza', corNome: 'Vermelho' },
  { color: '#008000', label: 'Geografia', corNome: 'Verde' },
  { color: '#FFFF00', label: 'Arte e Cultura', corNome: 'Amarelo' },
  { color: '#0000FF', label: 'Esportes e Entretenimento', corNome: 'Azul' }
];
const segmentAngle = 360 / segments.length;
const radius = canvas.width / 2;
let currentRotation = 0;
let isSpinning = false;
let corSorteadaGlobal = ''; // Para guardar a cor sorteada

// --- Partes do Corpo (RE-ADICIONADAS) ---
const partesDoCorpo = [
  'Mão Direita',
  'Mão Esquerda',
  'Pé Direito',
  'Pé Esquerdo'
];

// --- Banco de Perguntas (RE-ADICIONADO) ---
const questionBank = {
  'Ciência e Natureza': [
    { q: 'Qual planeta é conhecido como "Planeta Vermelho"?', a: ['Júpiter', 'Marte', 'Vênus'], correct: 1 },
    { q: 'Qual é o símbolo químico da água?', a: ['H2O', 'CO2', 'O2'], correct: 0 },
    { q: 'Quantos planetas existem no nosso Sistema Solar?', a: ['8', '9', '10'], correct: 0 },
    { q: 'Qual é o maior órgão do corpo humano?', a: ['Coração', 'Cérebro', 'Pele'], correct: 2 },
    { q: 'Qual é a velocidade da luz (aproximada)?', a: ['150.000 km/s', '300.000 km/s', '500.000 km/s'], correct: 1 },
    { q: 'Quem formulou a teoria da relatividade geral?', a: ['Isaac Newton', 'Albert Einstein', 'Galileu Galilei'], correct: 1 },
    { q: 'O que as abelhas recolhem para fazer mel?', a: ['Pólen', 'Água', 'Néctar'], correct: 2 },
    { q: 'Qual gás as plantas absorvem da atmosfera?', a: ['Oxigênio', 'Dióxido de Carbono', 'Nitrogênio'], correct: 1 }
  ],
  'Geografia': [
    { q: 'Qual é o maior continente do mundo?', a: ['Ásia', 'África', 'América'], correct: 0 },
    { q: 'Qual é o rio mais longo do mundo?', a: ['Nilo', 'Amazonas', 'Mississipi'], correct: 1 },
    { q: 'Onde fica a Torre Eiffel?', a: ['Londres', 'Berlim', 'Paris'], correct: 2 },
    { q: 'Qual é a capital do Brasil?', a: ['São Paulo', 'Rio de Janeiro', 'Brasília'], correct: 2 },
    { q: 'Qual é a montanha mais alta do mundo?', a: ['K2', 'Evereste', 'Mont Blanc'], correct: 1 },
    { q: 'Em que país ficam as pirâmides de Gizé?', a: ['Grécia', 'Egito', 'Sudão'], correct: 1 },
    { q: 'Qual é o menor país do mundo?', a: ['Mônaco', 'Nauru', 'Vaticano'], correct: 2 },
    { q: 'Qual é o maior deserto quente do mundo?', a: ['Saara', 'Gobi', 'Atacama'], correct: 0 }
  ],
  'Arte e Cultura': [
    { q: 'Quem pintou a "Mona Lisa"?', a: ['Michelangelo', 'Leonardo da Vinci', 'Donatello'], correct: 1 },
    { q: 'Quem escreveu "Dom Quixote"?', a: ['Machado de Assis', 'Shakespeare', 'Miguel de Cervantes'], correct: 2 },
    { q: 'Qual banda tinha John, Paul, George e Ringo?', a: ['Queen', 'The Beatles', 'Rolling Stones'], correct: 1 },
    { q: 'Em que país nasceu a Ópera?', a: ['França', 'Itália', 'Alemanha'], correct: 1 },
    { q: 'Qual arquiteto brasileiro projetou Brasília?', a: ['Aleijadinho', 'Oscar Niemeyer', 'Burle Marx'], correct: 1 },
    { q: 'Quem escreveu o conto original da "Pequena Sereia"?', a: ['Irmãos Grimm', 'Hans Christian Andersen', 'Monteiro Lobato'], correct: 1 },
    { q: 'Qual instrumento Beethoven era famoso por tocar?', a: ['Violino', 'Piano', 'Flauta'], correct: 1 },
    { q: 'Quem esculpiu a famosa estátua de "David"?', a: ['Leonardo da Vinci', 'Michelangelo', 'Rafael'], correct: 1 }
  ],
  'Esportes e Entretenimento': [
    { q: 'Em que país o futebol moderno foi formalizado?', a: ['Brasil', 'Inglaterra', 'Espanha'], correct: 1 },
    { q: 'Quantos jogadores há num time de basquete em quadra?', a: ['5', '6', '7'], correct: 0 },
    { q: 'Qual país ganhou mais Copas do Mundo de Futebol?', a: ['Alemanha', 'Itália', 'Brasil'], correct: 2 },
    { q: 'Qual o evento que ocorre a cada 4 anos com atletas de todo o mundo?', a: ['Copa do Mundo', 'Jogos Olímpicos', 'Super Bowl'], correct: 1 },
    { q: 'Quem é conhecido como "O Rei do Futebol"?', a: ['Maradona', 'Messi', 'Pelé'], correct: 2 },
    { q: 'Em que esporte se usa um "birdie" ou "peteca"?', a: ['Tênis', 'Badminton', 'Squash'], correct: 1 },
    { q: 'Quantos rounds tem uma luta principal de boxe por título mundial?', a: ['10', '12', '15'], correct: 1 },
    { q: 'Qual o principal torneio de tênis jogado em grama?', a: ['Roland Garros', 'Wimbledon', 'US Open'], correct: 1 }
  ]
};

let availableQuestions = JSON.parse(JSON.stringify(questionBank));

// --- Estado do Jogo ---
let acertosCount = 0;
const perguntasTotal = 32;
let questionsAnswered = 0;
let currentQuestion = null;

// --- Funções do Jogo ---

function desenharRoleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = radius;
  const centerY = radius;

  segments.forEach((segment, i) => {
    const startAngle = (i * segmentAngle * Math.PI) / 180;
    const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = segment.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // <!-- INÍCIO DA ALTERAÇÃO: Remove o texto da roleta -->
    /*
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Poppins'; // Fonte menor para caber o texto
    ctx.fillText(segment.label, radius - 15, 5);
    ctx.restore();
    */
    // <!-- FIM DA ALTERAÇÃO -->
  });
}

function girarRoleta() {
  if (isSpinning) return;
  
  Tone.start().then(() => { spinSound.triggerAttackRelease("4n"); });

  isSpinning = true;
  botaoGirar.disabled = true;
  btnProxima.disabled = true;
  perguntaContainer.style.display = 'none';
  resultado.textContent = 'Girando...';

  const randomSpin = Math.floor(Math.random() * 360) + 360 * 5;
  currentRotation += randomSpin;

  canvas.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
  canvas.style.transform = `rotate(${currentRotation}deg)`;

  canvas.addEventListener('transitionend', onSpinEnd, { once: true });
}

function onSpinEnd() {
  isSpinning = false;
  
  const finalAngle = currentRotation % 360;
  
  // <!-- ALTERAÇÃO: Corrigido o cálculo do ângulo. -->
  // A seta está no topo (270 graus), não na direita (0 ou 360).
  // A lógica anterior era: const winningAngle = (360 - finalAngle) % 360;
  const winningAngle = (270 - finalAngle + 360) % 360;
  
  const winningSegmentIndex = Math.floor(winningAngle / segmentAngle);
  const winningSegment = segments[winningSegmentIndex];

  corSorteadaGlobal = winningSegment.corNome; // Salva o nome da cor (ex: "Vermelho")
  
  // <!-- ALTERAÇÃO: Mostrar a cor sorteada, não a categoria -->
  resultado.textContent = `Cor: ${winningSegment.corNome}!`;
  
  mostrarPergunta(winningSegment.label); // Mostra a pergunta da categoria
}

function mostrarPergunta(categoryLabel) {
  if (questionsAnswered >= perguntasTotal) {
    fimDeJogo();
    return;
  }

  if (availableQuestions[categoryLabel].length === 0) {
    resultado.textContent = `Sem mais perguntas de ${categoryLabel}. Gire de novo!`;
    botaoGirar.disabled = false;
    return;
  }

  currentQuestion = availableQuestions[categoryLabel].shift();
  
  textoPergunta.textContent = currentQuestion.q;
  alternativas.innerHTML = '';

  currentQuestion.a.forEach((alt, index) => {
    const altDiv = document.createElement('div');
    altDiv.classList.add('alternativa');
    altDiv.textContent = alt;
    altDiv.dataset.index = index;
    altDiv.addEventListener('click', verificarResposta);
    alternativas.appendChild(altDiv);
  });

  perguntaContainer.style.display = 'block';
}

/**
 * Lógica MISTA: Verifica a resposta E GERA O COMANDO DO TWISTER
 */
function verificarResposta(e) {
  const selectedIndex = parseInt(e.target.dataset.index);
  const correctIndex = currentQuestion.correct;
  const allButtons = alternativas.querySelectorAll('.alternativa');

  allButtons.forEach(btn => { btn.classList.add('disabled'); });

  if (selectedIndex === correctIndex) {
    // --- ACERTOU ---
    e.target.classList.add('correct');
    correctSound.triggerAttackRelease("C5", "8n", Tone.now());
    acertosCount++;
    
    // Sorteia a parte do corpo
    const parteSorteada = partesDoCorpo[Math.floor(Math.random() * partesDoCorpo.length)];
    
    // Mostra o comando do Twister
    resultado.textContent = `ACERTOU! ${parteSorteada} no ${corSorteadaGlobal}!`;
    
  } else {
    // --- ERROU ---
    e.target.classList.add('incorrect');
    allButtons[correctIndex].classList.add('correct');
    errorSound.triggerAttackRelease("C3", "8n", Tone.now());
    
    // Mostra o resultado "salvo"
    resultado.textContent = `ERROU! O jogador está salvo nesta rodada.`;
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
  perguntaContainer.style.display = 'none';
  btnProxima.disabled = true;
  botaoGirar.disabled = false;
  resultado.textContent = 'Gire a roleta para a próxima jogada!';
}

function fimDeJogo() {
    resultado.textContent = `Fim de Jogo! Pontuação final: ${acertosCount} de ${perguntasTotal}!`;
    perguntaContainer.style.display = 'none';
    btnProxima.disabled = true;
    botaoGirar.disabled = true;
    botaoGirar.textContent = "Recarregue para jogar";
}

// --- Funções do Modal ---
function abrirModal() { modalRegras.style.display = 'flex'; }
function fecharModal() { modalRegras.style.display = 'none'; }

// --- Inicialização ---
botaoGirar.addEventListener('click', girarRoleta);
btnProxima.addEventListener('click', proximaRodada);
btnRegras.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);

modalRegras.addEventListener('click', (e) => {
  if (e.target === modalRegras) { fecharModal(); }
});

desenharRoleta();
updateInfo();

perguntasRestantesEl.textContent = `Jogadas restantes: ${perguntasTotal}`;







