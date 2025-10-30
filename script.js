 const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

const roleta = document.getElementById("roleta");
const resultado = document.getElementById("resultado");

const membros = ["Mão direita", "Mão esquerda", "Pé direito", "Pé esquerdo"];
const cores = ["vermelho", "azul", "verde", "amarelo"];

let perguntaAtual;
let acertos = 0;
let perguntasFeitas = 0;

const perguntas = [
  "Qual é o maior planeta do Sistema Solar?|júpiter",
  "Quem pintou a Mona Lisa?|leonardo da vinci",
  "Qual é a capital da França?|paris",
  "Qual é a fórmula da água?|h2o",
  "Em que continente fica o Egito?|áfrica",
  "Qual é o rio mais extenso do mundo?|nilo",
  "Quem foi o primeiro homem a pisar na Lua?|neil armstrong",
  "Quanto é 12 x 12?|144",
  "Qual é o país com a maior população?|china",
  "Qual é a capital do Japão?|tóquio",
  "Quem escreveu Dom Quixote?|miguel de cervantes",
  "Qual é o metal líquido à temperatura ambiente?|mercúrio",
  "Em que país fica a Torre Eiffel?|frança",
  "Qual é o animal mais rápido do mundo?|guepardo",
  "Em que ano o Brasil foi descoberto?|1500",
  "Qual é a capital da Austrália?|camberra",
  "Qual é o maior oceano?|pacífico",
  "Quem foi Albert Einstein?|cientista",
  "Qual é o menor país do mundo?|vaticano",
  "Qual é o símbolo químico do ouro?|au",
  "Em que cidade fica o Cristo Redentor?|rio de janeiro",
  "Quantos continentes existem?|6",
  "Qual é o idioma mais falado?|inglês",
  "Quem descobriu a gravidade?|isaac newton",
  "Qual é o planeta vermelho?|marte",
  "Quantos planetas há no Sistema Solar?|8",
  "Qual o animal símbolo da Austrália?|canguru",
  "Qual é a moeda dos EUA?|dólar",
  "Quem escreveu A Ilíada?|homero",
  "Qual é o maior deserto do mundo?|antártico",
  "Qual é o segundo planeta do Sol?|vênus",
  "Qual é a língua oficial do Brasil?|português",
  "Quem inventou o telefone?|graham bell",
  "Qual é a capital da Argentina?|buenos aires",
  "Quantos dias tem um ano bissexto?|366",
  "Qual é o maior mamífero?|baleia azul",
  "Quem pintou o teto da Capela Sistina?|michelangelo",
  "Qual é a cor do sangue humano?|vermelho",
  "Qual é a capital da Itália?|roma",
  "Em que continente fica o Canadá?|américa do norte"
].map(q => {
  const [pergunta, resposta] = q.split("|");
  return { pergunta, resposta };
});

function novaPergunta() {
  perguntasFeitas++;
  const p = perguntas[Math.floor(Math.random() * perguntas.length)];
  perguntaAtual = p;
  document.getElementById("textoPergunta").textContent = p.pergunta;
  document.getElementById("resposta").value = "";
  document.getElementById("botaoGirar").disabled = true;
  document.getElementById("perguntasRestantes").textContent =
    `Perguntas restantes: ${40 - perguntasFeitas}`;
}

function verificarResposta() {
  const resp = document.getElementById("resposta").value.trim().toLowerCase();
  if (resp === perguntaAtual.resposta) {
    somCorreto.play();
    acertos++;
    document.getElementById("acertos").textContent = `Acertos: ${acertos} ✅`;
    document.getElementById("botaoGirar").disabled = false;
    document.getElementById("textoPergunta").textContent = "✅ Resposta correta! Gire a roleta!";
  } else {
    somErro.play();
    document.getElementById("textoPergunta").textContent = "❌ Tente novamente!";
  }
}

function girar() {
  somGiro.play();
  const angulo = Math.floor(Math.random() * 3600 + 720);
  roleta.style.transform = `rotate(${angulo}deg)`;

  setTimeout(() => {
    const membro = membros[Math.floor(Math.random() * membros.length)];
    const cor = cores[Math.floor(Math.random() * cores.length)];
    resultado.innerHTML = `👉 <strong>${membro}</strong> no <strong>${cor}</strong>!`;
    novaPergunta();
  }, 4000);
}

novaPergunta();


