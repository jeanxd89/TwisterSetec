 const cores = ["vermelho","azul","verde","amarelo"];
const membros = ["Mão direita","Mão esquerda","Pé direito","Pé esquerdo"];
const roleta = document.querySelector(".roleta");
const resultado = document.getElementById("resultado");
const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

let perguntasFeitas = 0;
let acertos = 0;
let perguntaAtual = null;

// 40 perguntas
const perguntas = [
  {pergunta:"Qual é a capital do Brasil?",resposta:"Brasília",alternativas:["Brasília","Rio de Janeiro","São Paulo","Salvador"]},
  {pergunta:"Quem pintou a Mona Lisa?",resposta:"Leonardo da Vinci",alternativas:["Leonardo da Vinci","Michelangelo","Van Gogh","Picasso"]},
  {pergunta:"Qual planeta é conhecido como planeta vermelho?",resposta:"Marte",alternativas:["Marte","Vênus","Júpiter","Mercúrio"]},
  {pergunta:"Quem escreveu Hamlet?",resposta:"William Shakespeare",alternativas:["William Shakespeare","Goethe","Camões","Cervantes"]},
  {pergunta:"Qual é o maior mamífero terrestre?",resposta:"Elefante africano",alternativas:["Elefante africano","Girafa","Hipopótamo","Rinoceronte"]},
  {pergunta:"Qual é o símbolo químico do ouro?",resposta:"Au",alternativas:["Au","Ag","Fe","Hg"]},
  {pergunta:"Quem é o pai da medicina?",resposta:"Hipócrates",alternativas:["Hipócrates","Galeno","Avicena","Paracelso"]},
  {pergunta:"Qual a velocidade da luz?",resposta:"299.792 km/s",alternativas:["299.792 km/s","150.000 km/s","1.000.000 km/s","300.000 km/s"]},
  {pergunta:"Qual país é famoso pelos samurais?",resposta:"Japão",alternativas:["Japão","China","Coreia","Tailândia"]},
  {pergunta:"Qual é a capital da Itália?",resposta:"Roma",alternativas:["Roma","Milão","Florença","Veneza"]},
  {pergunta:"Quem descobriu a gravidade?",resposta:"Isaac Newton",alternativas:["Isaac Newton","Galileu","Einstein","Aristóteles"]},
  {pergunta:"Qual é o maior lago do mundo?",resposta:"Mar Cáspio",alternativas:["Mar Cáspio","Lago Vitória","Lago Superior","Lago Baikal"]},
  {pergunta:"Qual animal é símbolo da Austrália?",resposta:"Canguru",alternativas:["Canguru","Coala","Dingo","Emu"]},
  {pergunta:"Qual é a menor unidade de vida?",resposta:"Célula",alternativas:["Célula","Molécula","Átomo","Organelo"]},
  {pergunta:"Qual é a língua oficial do Brasil?",resposta:"Português",alternativas:["Português","Espanhol","Inglês","Francês"]},
  {pergunta:"Quem pintou O Grito?",resposta:"Edvard Munch",alternativas:["Edvard Munch","Van Gogh","Picasso","Monet"]},
  {pergunta:"Qual é o planeta com anéis visíveis?",resposta:"Saturno",alternativas:["Saturno","Júpiter","Urano","Netuno"]},
  {pergunta:"Qual é o menor osso do corpo humano?",resposta:"Estribo",alternativas:["Fêmur","Tíbia","Esterno","Estribo"]},
  {pergunta:"Quem escreveu O Pequeno Príncipe?",resposta:"Antoine de Saint-Exupéry",alternativas:["Antoine de Saint-Exupéry","J.K. Rowling","Hans Christian Andersen","Roald Dahl"]},
  {pergunta:"Qual continente é chamado de Velho Mundo?",resposta:"Europa",alternativas:["Europa","África","Ásia","América"]},
  // ... adicione mais até 40 perguntas
];

function shuffleArray(array){ return array.sort(()=>Math.random()-0.5); }

function novaPergunta(){
  if(perguntasFeitas>=40){
    resultado.innerHTML="🎉 Você completou todas as perguntas!";
    document.getElementById("botaoGirar").disabled=true;
    document.getElementById("alternativas").innerHTML="";
    return;
  }

  perguntasFeitas++;
  const p = perguntas[Math.floor(Math.random()*perguntas.length)];
  perguntaAtual = p;

  document.getElementById("textoPergunta").textContent = p.pergunta;
  const altDiv = document.getElementById("alternativas");
  altDiv.innerHTML = "";
  altDiv.style.display = "flex";

  shuffleArray(p.alternativas).forEach(a=>{
    const btn = document.createElement("div");
    btn.className="alternativa";
    btn.textContent=a;
    btn.onclick = ()=>verificarResposta(a);
    altDiv.appendChild(btn);
  });

  document.getElementById("perguntasRestantes").textContent = `Perguntas restantes: ${40-perguntasFeitas}`;
}

function verificarResposta(a){
  if(a===perguntaAtual.resposta){
    resultado.innerHTML="✅ Resposta correta!";
    acertos++;
    somCorreto.play();
  } else{
    resultado.innerHTML=`❌ Errado! A resposta certa é: ${perguntaAtual.resposta}`;
    somErro.play();
  }
  document.getElementById("acertos").textContent=`Acertos: ${acertos} ✅`;
  document.getElementById("botaoGirar").disabled=false;
  document.getElementById("btnProxima").disabled=true;
  document.querySelectorAll('.brilho-overlay').forEach(b=>b.classList.remove('active'));







