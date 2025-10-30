 const perguntas = [
  { pergunta: "Qual é o maior planeta do Sistema Solar?", resposta: "júpiter" },
  { pergunta: "Quem pintou a Mona Lisa?", resposta: "leonardo da vinci" },
  { pergunta: "Qual é o elemento químico representado por O?", resposta: "oxigênio" },
  { pergunta: "Em que continente fica o Egito?", resposta: "áfrica" },
  { pergunta: "Qual é o rio mais extenso do mundo?", resposta: "nilo" },
  { pergunta: "Quem foi o primeiro homem a pisar na Lua?", resposta: "neil armstrong" },
  { pergunta: "Qual é o país com a maior população do mundo?", resposta: "china" },
  { pergunta: "Quanto é 12 x 12?", resposta: "144" },
  { pergunta: "Qual é a capital do Japão?", resposta: "tóquio" },
  { pergunta: "Quem escreveu 'Dom Quixote'?", resposta: "miguel de cervantes" },
  { pergunta: "Qual é o metal líquido à temperatura ambiente?", resposta: "mercúrio" },
  { pergunta: "Em que país fica a Torre Eiffel?", resposta: "frança" },
  { pergunta: "Qual é o animal mais rápido do mundo?", resposta: "guepardo" },
  { pergunta: "Em que ano o Brasil foi descoberto?", resposta: "1500" },
  { pergunta: "Qual é a capital da Austrália?", resposta: "camberra" },
  { pergunta: "Qual é o maior oceano do planeta?", resposta: "pacífico" },
  { pergunta: "Quem foi Albert Einstein?", resposta: "cientista" },
  { pergunta: "Qual o menor país do mundo?", resposta: "vaticano" },
  { pergunta: "Qual é o símbolo químico do ouro?", resposta: "au" },
  { pergunta: "Em que cidade fica o Cristo Redentor?", resposta: "rio de janeiro" },
  { pergunta: "Quantos continentes existem?", resposta: "6" },
  { pergunta: "Qual é o idioma mais falado do mundo?", resposta: "inglês" },
  { pergunta: "Qual é o país conhecido como 'Terra do Sol Nascente'?", resposta: "japão" },
  { pergunta: "Quem descobriu a gravidade?", resposta: "isaac newton" },
  { pergunta: "Qual é a capital da Itália?", resposta: "roma" },
  { pergunta: "Quantos planetas existem no Sistema Solar?", resposta: "8" },
  { pergunta: "Qual o animal símbolo da Austrália?", resposta: "canguru" },
  { pergunta: "Qual é a moeda usada nos Estados Unidos?", resposta: "dólar" },
  { pergunta: "Em que continente fica o Brasil?", resposta: "américa do sul" },
  { pergunta: "Quem escreveu 'A Ilíada'?", resposta: "homero" },
  { pergunta: "Qual é o maior deserto do mundo?", resposta: "antártico" },
  { pergunta: "Qual é o segundo planeta mais próximo do Sol?", resposta: "vênus" },
  { pergunta: "Qual é a cor do sangue dos humanos?", resposta: "vermelho" },
  { pergunta: "Qual é a língua oficial do Brasil?", resposta: "português" },
  { pergunta: "Quem inventou o telefone?", resposta: "graham bell" },
  { pergunta: "Qual é a capital da Argentina?", resposta: "buenos aires" },
  { pergunta: "Quantos dias tem um ano bissexto?", resposta: "366" },
  { pergunta: "Qual é o maior mamífero do mundo?", resposta: "baleia azul" },
  { pergunta: "Qual é a capital da França?", resposta: "paris" },
  { pergunta: "Qual é a fórmula da água?", resposta: "h2o" },
  { pergunta: "Em que continente fica o Canadá?", resposta: "américa do norte" },
  { pergunta: "Quem pintou o teto da Capela Sistina?", resposta: "michelangelo" }
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
  const seta = document.getElementById("seta");
  const angulo = Math.floor(Math.random() * 3600 + 720); // 2 a 10 voltas
  somGiro.play();

  // Gira a roleta e a seta juntas
  roleta.style.transform = `rotate(${angulo}deg)`;
  seta.style.transform = `translate(-50%, -100%) rotate(${angulo}deg)`;

  setTimeout(() => {
    const membro = membros[Math.floor(Math.random() * membros.length)];
    const cor = cores[Math.floor(Math.random() * cores.length)];
    document.getElementById("resultado").textContent = `👉 ${membro} no ${cor}!`;
    novaPergunta();
  }, 4000);
}

novaPergunta();

