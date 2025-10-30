 const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

const roleta = document.getElementById("roleta");
const resultado = document.getElementById("resultado");
const membros = ["Mão direita","Mão esquerda","Pé direito","Pé esquerdo"];
const cores = ["vermelho","azul","verde","amarelo"];

let perguntaAtual, acertos=0, perguntasFeitas=0;

// Perguntas com múltipla escolha
const perguntas = [
  {pergunta:"Qual é o maior planeta do Sistema Solar?",resposta:"Júpiter", alternativas:["Marte","Terra","Júpiter","Saturno"]},
  {pergunta:"Quem pintou a Mona Lisa?",resposta:"Leonardo da Vinci", alternativas:["Michelangelo","Leonardo da Vinci","Rafael","Donatello"]},
  {pergunta:"Qual é a capital da França?",resposta:"Paris", alternativas:["Londres","Paris","Roma","Berlim"]},
  {pergunta:"Qual é a fórmula da água?",resposta:"H2O", alternativas:["H2O","CO2","O2","NaCl"]},
  {pergunta:"Em que continente fica o Egito?",resposta:"África", alternativas:["África","Ásia","Europa","América"]},
  {pergunta:"Qual é o rio mais extenso do mundo?",resposta:"Nilo", alternativas:["Amazonas","Nilo","Yangtzé","Mississipi"]},
  {pergunta:"Quem foi o primeiro homem a pisar na Lua?",resposta:"Neil Armstrong", alternativas:["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","Michael Collins"]},
  {pergunta:"Quanto é 12 x 12?",resposta:"144", alternativas:["144","124","154","134"]},
  {pergunta:"Qual é o país com a maior população?",resposta:"China", alternativas:["Índia","China","Estados Unidos","Brasil"]},
  {pergunta:"Qual é a capital do Japão?",resposta:"Tóquio", alternativas:["Tóquio","Seul","Pequim","Bangkok"]}
];

function shuffleArray(arr){
  return arr.sort(()=>Math.random()-0.5);
}

function novaPergunta(){
  perguntasFeitas++;
  document.getElementById("botaoGirar").disabled=true;
  document.getElementById("btnProxima").disabled=true;
  resultado.innerHTML="";
  
  const p = perguntas[Math.floor(Math.random()*perguntas.length)];
  perguntaAtual = p;
  document.getElementById("textoPergunta").textContent = p.pergunta;
  
  const altDiv = document.getElementById("alternativas");
  altDiv.innerHTML="";
  shuffleArray(p.alternativas).forEach(a=>{
    const btn = document.createElement("div");
    btn.className="alternativa";
    btn.textContent=a;
    btn.onclick = ()=>verificarResposta(a);
    altDiv.appendChild(btn);
  });

  document.getElementById("perguntasRestantes").textContent=`Perguntas restantes: ${40-perguntasFeitas}`;
}

function verificarResposta(resp){
  if(resp === perguntaAtual.resposta){
    somCorreto.play();
    acertos++;
    document.getElementById("acertos").textContent=`Acertos: ${acertos} ✅`;
    document.getElementById("botaoGirar").disabled=false;
    document.getElementById("btnProxima").disabled=false;
    resultado.innerHTML="✅ Resposta correta! Gire a roleta!";
  } else {
    somErro.play();
    resultado.innerHTML="❌ Resposta incorreta!";
  }
}

function girar(){
  somGiro.play();
  document.querySelectorAll(".brilho").forEach(b=>b.classList.remove("active"));

  const angulo=Math.floor(Math.random()*3600+720);
  roleta.style.transform=`rotate(${angulo}deg)`;

  setTimeout(()=>{
    const membro = membros[Math.floor(Math.random()*membros.length)];
    const cor = cores[Math.floor(Math.random()*cores.length)];
    const brilho = document.querySelector(`.brilho-${cor}`);
    if(brilho) brilho.classList.add("active");

    resultado.innerHTML=`👉 <strong>${membro}</strong> no <strong style="text-transform:capitalize">${cor}</strong>!`;
  },4000);
}

novaPergunta();





