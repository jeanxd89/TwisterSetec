 const canvas = document.getElementById("roletaCanvas");
const ctx = canvas.getContext("2d");
const cores = ["#FF3B3B","#3B7BFF","#3BFF6E","#FFD93B"];
const nomesCores = ["vermelho","azul","verde","amarelo"];
const membros = ["Mão direita","Mão esquerda","Pé direito","Pé esquerdo"];
const resultado = document.getElementById("resultado");
const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

let acertos = 0;
let perguntasFeitas = 0;
let perguntaAtual = null;
let girando = false;
let anguloAtual = 0;

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
  // ... adicione mais até 40 perguntas
];

// Função para desenhar roleta com efeito de iluminação animada
function desenharRoleta(){
  const raio = canvas.width/2;
  const centro = raio;
  const total = cores.length;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<total;i++){
    const inicio = (i*(2*Math.PI/total)) + anguloAtual;
    const fim = ((i+1)*(2*Math.PI/total)) + anguloAtual;

    // Gradiente radial para dar efeito de iluminação
    let grad = ctx.createRadialGradient(centro,centro,0,centro,centro,raio);
    grad.addColorStop(0,'#fff');
    grad.addColorStop(0.3, cores[i]);
    grad.addColorStop(1, '#000');
    
    ctx.beginPath();
    ctx.moveTo(centro,centro);
    ctx.arc(centro,centro,raio,inicio,fim);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  requestAnimationFrame(desenharRoleta);
}

desenharRoleta();

// Função para girar roleta
function girar(){
  if(girando) return;
  girando = true;
  const corIndex = Math.floor(Math.random()*4);
  const membroIndex = Math.floor(Math.random()*4);
  const giros = Math.floor(Math.random()*4 + 6); // 6 a 9 voltas
  const anguloFinal = (2*Math.PI*giros) + (3*Math.PI/2 - corIndex*(2*Math.PI/4) - Math.PI/8);

  const duracao = 4000;
  const start = performance.now();

  somGiro.play();

  function animar(now){
    const elapsed = now - start;
    const t = Math.min(elapsed/duracao,1);
    anguloAtual = anguloAtual + (anguloFinal - anguloAtual)*easeOutCubic(t);
    if(t<1){
      requestAnimationFrame(animar);
    } else {
      resultado.innerHTML = `Coloque a <strong>${membros[membroIndex]}</strong> na cor <strong>${nomesCores[corIndex]}</strong>`;
      girando = false;
      novaPergunta();
    }
  }

  requestAnimationFrame(animar);
}

function easeOutCubic(t){ return (--t)*t*t+1; }

// Perguntas
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
  document.getElementById("alternativas").style.display="none";
}

document.getElementById("botaoGirar").onclick = girar;
document.getElementById("btnProxima").onclick = novaPergunta;

novaPergunta();







