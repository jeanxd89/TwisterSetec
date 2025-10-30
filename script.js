const somGiro = document.getElementById("somGiro");
const somCorreto = document.getElementById("somCorreto");
const somErro = document.getElementById("somErro");

const roleta = document.getElementById("roleta");
const resultado = document.getElementById("resultado");
const membros = ["Mão direita","Mão esquerda","Pé direito","Pé esquerdo"];
const cores = ["vermelho","azul","verde","amarelo"];

let perguntaAtual, acertos=0, perguntasFeitas=0;

const perguntas = [
  {pergunta:"Qual é o maior planeta do Sistema Solar?",resposta:"Júpiter",alternativas:["Marte","Terra","Júpiter","Saturno"]},
  {pergunta:"Quem pintou a Mona Lisa?",resposta:"Leonardo da Vinci",alternativas:["Michelangelo","Leonardo da Vinci","Rafael","Donatello"]},
  {pergunta:"Qual é a capital da França?",resposta:"Paris",alternativas:["Londres","Paris","Roma","Berlim"]},
  {pergunta:"Qual é a fórmula da água?",resposta:"H2O",alternativas:["H2O","CO2","O2","NaCl"]},
  {pergunta:"Em que continente fica o Egito?",resposta:"África",alternativas:["África","Ásia","Europa","América"]},
  {pergunta:"Qual é o rio mais extenso do mundo?",resposta:"Nilo",alternativas:["Amazonas","Nilo","Yangtzé","Mississipi"]},
  {pergunta:"Quem foi o primeiro homem a pisar na Lua?",resposta:"Neil Armstrong",alternativas:["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","Michael Collins"]},
  {pergunta:"Quanto é 12 x 12?",resposta:"144",alternativas:["144","124","154","134"]},
  {pergunta:"Qual país tem a maior população?",resposta:"China",alternativas:["Índia","China","Estados Unidos","Brasil"]},
  {pergunta:"Qual é a capital do Japão?",resposta:"Tóquio",alternativas:["Tóquio","Seul","Pequim","Bangkok"]},
  {pergunta:"Quem descobriu a América?",resposta:"Cristóvão Colombo",alternativas:["Vasco da Gama","Cristóvão Colombo","Pedro Álvares Cabral","Fernão de Magalhães"]},
  {pergunta:"Qual é o metal cujo símbolo é Fe?",resposta:"Ferro",alternativas:["Ferro","Fósforo","Flúor","Fúlvio"]},
  {pergunta:"Qual é o maior oceano do mundo?",resposta:"Oceano Pacífico",alternativas:["Oceano Atlântico","Oceano Índico","Oceano Pacífico","Oceano Ártico"]},
  {pergunta:"Quem escreveu 'Dom Quixote'?",resposta:"Miguel de Cervantes",alternativas:["Miguel de Cervantes","William Shakespeare","Fernando Pessoa","Eça de Queirós"]},
  {pergunta:"Qual animal é conhecido como Rei da Selva?",resposta:"Leão",alternativas:["Tigre","Leão","Elefante","Gorila"]},
  {pergunta:"Qual a capital do Brasil?",resposta:"Brasília",alternativas:["São Paulo","Rio de Janeiro","Brasília","Salvador"]},
  {pergunta:"Qual é o maior deserto do mundo?",resposta:"Deserto do Saara",alternativas:["Deserto da Arábia","Deserto da Antártida","Deserto do Saara","Deserto de Gobi"]},
  {pergunta:"Quem inventou a lâmpada?",resposta:"Thomas Edison",alternativas:["Nikola Tesla","Alexander Graham Bell","Thomas Edison","James Watt"]},
  {pergunta:"Qual é o gás que respiramos?",resposta:"Oxigênio",alternativas:["Oxigênio","Nitrogênio","Hidrogênio","Dióxido de Carbono"]},
  {pergunta:"Qual a moeda do Japão?",resposta:"Iene",alternativas:["Iene","Yuan","Won","Dólar"]},
  {pergunta:"Quem escreveu 'A Divina Comédia'?",resposta:"Dante Alighieri",alternativas:["Dante Alighieri","William Shakespeare","Goethe","Camões"]},
  {pergunta:"Qual é a velocidade da luz?",resposta:"299.792 km/s",alternativas:["299.792 km/s","150.000 km/s","1.000.000 km/s","300.000 km/s"]},
  {pergunta:"Quem é o autor de 'O Pequeno Príncipe'?",resposta:"Antoine de Saint-Exupéry",alternativas:["Antoine de Saint-Exupéry","J.K. Rowling","Hans Christian Andersen","Roald Dahl"]},
  {pergunta:"Qual é o planeta vermelho?",resposta:"Marte",alternativas:["Marte","Vênus","Mercúrio","Júpiter"]},
  {pergunta:"Quem pintou 'O Grito'?",resposta:"Edvard Munch",alternativas:["Edvard Munch","Van Gogh","Picasso","Monet"]},
  {pergunta:"Qual é a capital da Itália?",resposta:"Roma",alternativas:["Roma","Milão","Florença","Veneza"]},
  {pergunta:"Qual animal é símbolo da Austrália?",resposta:"Canguru",alternativas:["Canguru","Coala","Dingo","Emu"]},
  {pergunta:"Qual é a língua oficial do Brasil?",resposta:"Português",alternativas:["Português","Espanhol","Inglês","Francês"]},
  {pergunta:"Quem é conhecido como Pai da Medicina?",resposta:"Hipócrates",alternativas:["Hipócrates","Galeno","Avicena","Paracelso"]},
  {pergunta:"Qual é o elemento químico do ouro?",resposta:"Au",alternativas:["Au","Ag","Fe","Hg"]},
  {pergunta:"Qual planeta é conhecido pelos seus anéis?",resposta:"Saturno",alternativas:["Saturno","Júpiter","Urano","Netuno"]},
  {pergunta:"Quem escreveu 'Hamlet'?",resposta:"William Shakespeare",alternativas:["William Shakespeare","Miguel de Cervantes","Goethe","Voltaire"]},
  {pergunta:"Qual é o maior mamífero terrestre?",resposta:"Elefante africano",alternativas:["Elefante africano","Girafa","Hipopótamo","Baleia azul"]},
  {pergunta:"Qual é a capital da Rússia?",resposta:"Moscou",alternativas:["Moscou","São Petersburgo","Kiev","Varsóvia"]},
  {pergunta:"Quem descobriu a gravidade?",resposta:"Isaac Newton",alternativas:["Galileu Galilei","Isaac Newton","Albert Einstein","Aristóteles"]},
  {pergunta:"Qual é o símbolo químico do oxigênio?",resposta:"O",alternativas:["O","H","C","N"]},
  {pergunta:"Qual continente é conhecido como 'Velho Mundo'?",resposta:"Europa",alternativas:["Europa","África","Ásia","América"]},
  {pergunta:"Qual país é famoso pelos samurais?",resposta:"Japão",alternativas:["Japão","China","Coreia","Tailândia"]},
  {pergunta:"Qual é o menor osso do corpo humano?",resposta:"Estribo",alternativas:["Fêmur","Tíbia","Esterno","Estribo"]},
  {pergunta:"Quem pintou 'Guernica'?",resposta:"Pablo Picasso",alternativas:["Pablo Picasso","Salvador Dalí","Van Gogh","Monet"]},
  {pergunta:"Qual é o maior lago do mundo?",resposta:"Mar Cáspio",alternativas:["Mar Cáspio","Lago Vitória","Lago Superior","Lago Baikal"]}
];

// UTILS
function shuffleArray(array){
  return array.sort(()=>Math.random()-0.5);
}

// GIRAR ROLETA
function girar(){
  const angulo = Math.floor(Math.random()*360)+720;
  const corIndex = Math.floor(Math.random()*4);
  const membroIndex = Math.floor(Math.random()*4);
  
  roleta.style.transform = `rotate(${angulo}deg)`;
  somGiro.play();

  // Reset brilho
  document.querySelectorAll('.brilho').forEach(b=>b.classList.remove('active'));
  setTimeout(()=>{
    document.querySelectorAll('.brilho')[corIndex].classList.add('active');
    resultado.innerHTML = `Coloque a <strong>${membros[membroIndex]}</strong> na cor <strong>${cores[corIndex]}</strong>`;
    document.getElementById("botaoGirar").disabled = true;
    document.getElementById("btnProxima").disabled = false;
    novaPergunta();
  }, 2000);
}

// NOVA PERGUNTA
function novaPergunta(){
  if(perguntasFeitas>=40){
    resultado.innerHTML="🎉 Você completou todas as perguntas!";
    document.getElementById("botaoGirar").disabled=true;
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

// VERIFICAR RESPOSTA
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
  document.getElementById("btnProxima").disabled=false;
}

// Inicializa primeira pergunta
document.getElementById("botaoGirar").disabled=false;
novaPergunta();






