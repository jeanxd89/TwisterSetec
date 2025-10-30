const perguntas = [
  { pergunta: "Qual é a cor resultante da mistura de azul e amarelo?", resposta: "verde" },
  { pergunta: "Quantas cores há no arco-íris?", resposta: "7" },
  { pergunta: "Qual planeta é conhecido como o planeta vermelho?", resposta: "marte" },
  { pergunta: "Qual é o maior mamífero do mundo?", resposta: "baleia azul" },
  { pergunta: "Quanto é 9 x 9?", resposta: "81" }
];

const membros = ["Mão direita", "Mão esquerda", "Pé direito", "Pé esquerdo"];
const cores = ["vermelho", "azul", "verde", "amarelo"];

const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

let perguntaAtual;

function novaPergunta() {
  perguntaAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
  document.getElementById("textoPergunta").textContent = perguntaAtual.pergunta;
  document.getElementById("resposta").value = "";
  document.getElementById("botaoGirar").disabled = true;
}

function verificarResposta() {
  const resp = document.getElementById("resposta").value.trim().toLowerCase();
  if (resp === perguntaAtual.resposta) {
    somCorreto.play();
    alert("✅ Resposta correta! Agora você pode girar a roleta!");
    document.getElementById("botaoGirar").disabled = false;
  } else {
    somErro.play();
    alert("❌ Resposta incorreta! Tente novamente!");
  }
}

function girar() {
  const roleta = document.getElementById("roleta");
  const angulo = Math.floor(Math.random() * 3600 + 720); // 2 a 10 voltas
  somGiro.play();
  roleta.style.transform = `rotate(${angulo}deg)`;

  setTimeout(() => {
    const membro = membros[Math.floor(Math.random() * membros.length)];
    const cor = cores[Math.floor(Math.random() * cores.length)];
    document.getElementById("resultado").textContent = `👉 ${membro} no ${cor}!`;
    novaPergunta();
  }, 4000);
}

// Inicializa primeira pergunta
novaPergunta();

