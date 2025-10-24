const roleta = document.getElementById('roleta');
const botao = document.getElementById('girar');

botao.addEventListener('click', () => {
  const rotacao = 360 * (3 + Math.random() * 3) + Math.floor(Math.random() * 360);
  
  roleta.style.transform = `rotate(${rotacao}deg)`;

  // Após o giro, detectar o resultado
  setTimeout(() => {
    const anguloFinal = rotacao % 360;
    let premio = "";

    if (anguloFinal < 60) premio = "💥 Vermelho";
    else if (anguloFinal < 120) premio = "💙 Azul";
    else if (anguloFinal < 180) premio = "💚 Verde";
    else if (anguloFinal < 240) premio = "💛 Amarelo";
    else if (anguloFinal < 300) premio = "💜 Roxo";
    else premio = "💧 Ciano";

    alert(`Você caiu em: ${premio}!`);
  }, 4200);
});
