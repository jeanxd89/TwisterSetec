  <script>
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

        // Sons mais suaves para crianças
        const spinSound = new Tone.NoiseSynth({ 
            noise: { type: "brown" }, 
            envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.2 } 
        }).toDestination();
        
        const correctSound = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 }
        }).toDestination();
        
        const errorSound = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 }
        }).toDestination();

        const segments = [
            { color: "#e53935", label: "Animais", corNome: "Vermelho" },
            { color: "#43a047", label: "Cores", corNome: "Verde" },
            { color: "#fdd835", label: "Brinquedos", corNome: "Amarelo" },
            { color: "#1e88e5", label: "Comidas", corNome: "Azul" }
        ];

        const segmentAngle = 360 / segments.length;
        const radius = canvas.width / 2;
        let currentRotation = 0;
        let isSpinning = false;
        let corSorteadaGlobal = "";

        const partesDoCorpo = ["Mão Direita", "Mão Esquerda", "Pé Direito", "Pé Esquerdo"];

        // BANCO DE PERGUNTAS FÁCEIS PARA CRIANÇAS
        const questionBank = {
            "Animais": [
                { q: "Que animal faz 'au au'?", a: ["Gato", "Cachorro", "Vaca"], correct: 1 },
                { q: "Que animal mia?", a: ["Cachorro", "Gato", "Pato"], correct: 1 },
                { q: "Que animal dá leite?", a: ["Galinha", "Vaca", "Porco"], correct: 1 },
                { q: "Que animal bota ovos?", a: ["Cachorro", "Galinha", "Gato"], correct: 1 },
                { q: "Que animal nada no água?", a: ["Gato", "Peixe", "Coelho"], correct: 1 },
                { q: "Que animal tem listras pretas e brancas?", a: ["Elefante", "Zebra", "Girafa"], correct: 1 },
                { q: "Que animal é o rei da selva?", a: ["Elefante", "Leão", "Macaco"], correct: 1 },
                { q: "Que animal tem pescoço comprido?", a: ["Girafa", "Hipopótamo", "Rinoceronte"], correct: 0 },
                { q: "Que animal voa no céu?", a: ["Pássaro", "Peixe", "Tartaruga"], correct: 0 },
                { q: "Que animal faz 'cócóricó'?", a: ["Pato", "Galinha", "Porco"], correct: 1 },
                { q: "Que animal é verde e pula?", a: ["Sapo", "Elefante", "Leão"], correct: 0 },
                { q: "Que animal tem casco?", a: ["Tartaruga", "Gato", "Cachorro"], correct: 0 },
                { q: "Que animal vive na Antártida?", a: ["Urso polar", "Pinguim", "Leão"], correct: 1 },
                { q: "Que animal tem tromba?", a: ["Elefante", "Girafa", "Zebra"], correct: 0 },
                { q: "Que animal é lento?", a: ["Coelho", "Tartaruga", "Guepardo"], correct: 1 }
            ],
            "Cores": [
                { q: "Que cor é uma folha?", a: ["Azul", "Verde", "Vermelho"], correct: 1 },
                { q: "Que cor é o céu durante o dia?", a: ["Preto", "Azul", "Verde"], correct: 1 },
                { q: "Que cor é o sol?", a: ["Amarelo", "Azul", "Verde"], correct: 0 },
                { q: "Que cor é uma banana?", a: ["Vermelho", "Amarelo", "Azul"], correct: 1 },
                { q: "Que cor é o morango?", a: ["Verde", "Azul", "Vermelho"], correct: 2 },
                { q: "Que cor é a neve?", a: ["Preta", "Branca", "Verde"], correct: 1 },
                { q: "Que cor é o chocolate?", a: ["Marrom", "Verde", "Azul"], correct: 0 },
                { q: "Que cor é a cenoura?", a: ["Laranja", "Roxa", "Azul"], correct: 0 },
                { q: "Que cor é a uva?", a: ["Roxa", "Amarela", "Verde"], correct: 0 },
                { q: "Que cor é o elefante?", a: ["Cinza", "Rosa", "Verde"], correct: 0 },
                { q: "Que cor fica misturando azul e amarelo?", a: ["Vermelho", "Verde", "Roxo"], correct: 1 },
                { q: "Que cor é o tronco da árvore?", a: ["Marrom", "Azul", "Amarelo"], correct: 0 },
                { q: "Que cor é o sapo?", a: ["Verde", "Rosa", "Azul"], correct: 0 },
                { q: "Que cor é o flamingo?", a: ["Rosa", "Verde", "Marrom"], correct: 0 },
                { q: "Que cor é o urso panda?", a: ["Preto e branco", "Verde", "Azul"], correct: 0 }
            ],
            "Brinquedos": [
                { q: "Com o que a gente brinca de montar?", a: ["Bola", "Lego", "Bicicleta"], correct: 1 },
                { q: "Que brinquedo pula?", a: ["Boneca", "Bola", "Carrinho"], correct: 1 },
                { q: "Onde a gente brinca de areia?", a: ["Parquinho", "Piscina", "Quarto"], correct: 0 },
                { q: "Que brinquedo vai rápido?", a: ["Carrinho", "Quebra-cabeça", "Massinha"], correct: 0 },
                { q: "Com o que a gente desenha?", a: ["Lápis", "Bola", "Boneco"], correct: 0 },
                { q: "Que brinquedo é fofo e de pelúcia?", a: ["Ursinho", "Bola", "Bicicleta"], correct: 0 },
                { q: "Onde a gente balança?", a: ["Gangorra", "Escorregador", "Balança"], correct: 2 },
                { q: "Que brinquedo voa?", a: ["Pipa", "Bola", "Boneca"], correct: 0 },
                { q: "Com o que a gente brinca na água?", a: ["Bolinha", "Carrinho", "Livro"], correct: 0 },
                { q: "Que brinquedo tem peças para encaixar?", a: ["Quebra-cabeça", "Bola", "Corda"], correct: 0 },
                { q: "Onde a gente escorrega?", a: ["Balanço", "Escorregador", "Gangorra"], correct: 1 },
                { q: "Que brinquedo roda?", a: ["Pião", "Boneca", "Lego"], correct: 0 },
                { q: "Com o que a gente brinca de casinha?", a: ["Boneca", "Bola", "Carrinho"], correct: 0 },
                { q: "Que brinquedo é para pular?", a: ["Corda", "Livro", "Quebra-cabeça"], correct: 0 },
                { q: "Onde a gente sobe e desce?", a: ["Gangorra", "Balanço", "Escorregador"], correct: 0 }
            ],
            "Comidas": [
                { q: "Que fruta é amarela?", a: ["Maçã", "Banana", "Uva"], correct: 1 },
                { q: "Que comida vem do leite?", a: ["Pão", "Queijo", "Arroz"], correct: 1 },
                { q: "Que fruta é vermelha?", a: ["Morango", "Banana", "Laranja"], correct: 0 },
                { q: "Que verdura é verde?", a: ["Cenoura", "Alface", "Beterraba"], correct: 1 },
                { q: "Que fruta tem caroço?", a: ["Manga", "Banana", "Morango"], correct: 0 },
                { q: "Que comida é feita de trigo?", a: ["Pão", "Queijo", "Iogurte"], correct: 0 },
                { q: "Que fruta é cítrica?", a: ["Laranja", "Banana", "Maçã"], correct: 0 },
                { q: "Que comida é doce?", a: ["Bolo", "Arroz", "Feijão"], correct: 0 },
                { q: "Que verdura é laranja?", a: ["Cenoura", "Alface", "Brócolis"], correct: 0 },
                { q: "Que fruta tem casca áspera?", a: ["Abacaxi", "Uva", "Maçã"], correct: 0 },
                { q: "Que comida vem da galinha?", a: ["Ovo", "Leite", "Pão"], correct: 0 },
                { q: "Que fruta é pequena e roxa?", a: ["Uva", "Melancia", "Abacaxi"], correct: 0 },
                { q: "Que comida é salgada?", a: ["Batata frita", "Bolo", "Sorvete"], correct: 0 },
                { q: "Que fruta tem água dentro?", a: ["Melancia", "Banana", "Morango"], correct: 0 },
                { q: "Que comida derrete no sol?", a: ["Sorvete", "Pão", "Queijo"], correct: 0 }
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
                ctx.lineWidth = 3;
                ctx.stroke();

                // texto centralizado
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(start + (end - start) / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = "#fff";
                ctx.font = "bold 16px Comic Sans MS";
                ctx.shadowColor = "rgba(0,0,0,0.5)";
                ctx.shadowBlur = 4;
                ctx.fillText(segment.corNome, radius - 25, 5);
                ctx.restore();
            });

            // Centro da roleta
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
            ctx.fillStyle = "#333";
            ctx.fill();
        }

        function girarRoleta() {
            if (isSpinning) return;

            Tone.start();
            spinSound.triggerAttackRelease("8n");

            isSpinning = true;
            botaoGirar.disabled = true;
            btnProxima.disabled = true;
            perguntaContainer.style.display = "none";
            resultado.textContent = "Girando... 🌀";

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
            resultado.textContent = `🎨 Cor: ${seg.corNome}!`;

            mostrarPergunta(seg.label);
        }

        function mostrarPergunta(cat) {
            const perguntas = availableQuestions[cat];
            if (!perguntas || perguntas.length === 0) {
                resultado.textContent = `Sem mais perguntas em ${cat}. Gire novamente.`;
                botaoGirar.disabled = false;
                return;
            }

            const randomIndex = Math.floor(Math.random() * perguntas.length);
            currentQuestion = perguntas[randomIndex];
            perguntas.splice(randomIndex, 1);

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
                correctSound.triggerAttackRelease("C6", "8n");
                acertosCount++;

                const parte = partesDoCorpo[Math.floor(Math.random() * partesDoCorpo.length)];
                resultado.textContent = `✅ ACERTOU! ${parte} no ${corSorteadaGlobal}!`;
                criarConfetti();
            } else {
                e.target.classList.add("incorrect");
                all[currentQuestion.correct].classList.add("correct");
                errorSound.triggerAttackRelease("A3", "8n");
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

        function criarConfetti() {
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.background = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffe66d'][Math.floor(Math.random() * 5)];
                    confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 2000);
                }, i * 100);
            }
        }

        function updateInfo() {
            acertosEl.textContent = `Pontos: ${acertosCount} ✅`;
            perguntasRestantesEl.textContent = `Jogadas: ${perguntasTotal - questionsAnswered}`;
        }

        function proximaRodada() {
            perguntaContainer.style.display = "none";
            btnProxima.disabled = true;
            botaoGirar.disabled = false;
            resultado.textContent = "Gire a roleta para a próxima jogada! 🎯";
        }

        function fimDeJogo() {
            let mensagem = "";
            if (acertosCount >= 8) {
                mensagem = "🏆 PARABÉNS! Você é um campeão! ";
            } else if (acertosCount >= 5) {
                mensagem = "🎉 Muito bom! Você foi muito bem! ";
            } else {
                mensagem = "😊 Boa tentativa! Vamos jogar de novo! ";
            }
            
            resultado.textContent = `${mensagem} Pontos: ${acertosCount} / ${perguntasTotal}`;
            botaoGirar.disabled = true;
            btnProxima.disabled = true;
            criarConfetti();
        }

        // Event Listeners
        btnRegras.addEventListener("click", () => modalRegras.style.display = "flex");
        btnFecharModal.addEventListener("click", () => modalRegras.style.display = "none");
        modalRegras.addEventListener("click", e => { 
            if (e.target === modalRegras) modalRegras.style.display = "none"; 
        });

        botaoGirar.addEventListener("click", girarRoleta);
        btnProxima.addEventListener("click", proximaRodada);

        // Inicialização
        desenharRoleta();
        updateInfo();

        // Efeito de inicialização
        setTimeout(() => {
            resultado.textContent = "Pronto para começar! Clique em Girar Roleta! 🎪";
        }, 1000);
    </script>
</body>
</html> 
