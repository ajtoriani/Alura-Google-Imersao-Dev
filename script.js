let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector(".busca");
let imgBanner = document.querySelector(".imgbanner"); // Seleciona o elemento do banner
let statsContainer = document.querySelector(".stats");
let dados = [];

campoBusca.addEventListener("input", iniciarBusca);
document.addEventListener("DOMContentLoaded", () => {
    iniciarQuiz();
    iniciarBusca();
});

function calcularEstatisticas(dados) {
    const totalPilotos = dados.length;
    const totalPodios = dados.reduce((acc, piloto) => acc + parseInt(piloto.podios), 0);
    const equipes = new Set(dados.map(piloto => piloto.equipe));
    const totalEquipes = equipes.size;

    statsContainer.innerHTML = `
        <div class="stat-item" style="--delay-index: 0;"><h3>${totalPilotos}</h3><p>Pilotos</p></div>
        <div class="stat-item" style="--delay-index: 1;"><h3>${totalEquipes}</h3><p>Equipes</p></div>
        <div class="stat-item" style="--delay-index: 2;"><h3>${totalPodios.toLocaleString('pt-BR')}</h3><p>Pódios Combinados</p></div>
    `;
}

async function iniciarBusca() {
    // Se os dados ainda não foram carregados, busca do JSON.
    if (dados.length === 0) {
        try {
            let resposta = await fetch("data.json");
            dados = await resposta.json();
            calcularEstatisticas(dados); // Calcula as estatísticas após carregar os dados
        } catch (error) {
            console.error("Falha ao buscar dados:", error);
            return; // Interrompe a execução se houver erro
        }
    }

    const termoBusca = campoBusca.value.toLowerCase();

    if (termoBusca) {
        imgBanner.style.display = "none"; // Esconde o banner se houver busca
    } else {
        imgBanner.style.display = "block"; // Mostra o banner se a busca estiver vazia
    }

    const dadosFiltrados = dados.filter(dado => 
        dado.nome.toLowerCase().includes(termoBusca) || 
        dado.equipe.toLowerCase().includes(termoBusca) || 
        dado.pais.toLowerCase().includes(termoBusca) ||
        // Busca também nas tags
        dado.tags.some(tag => tag.toLowerCase().includes(termoBusca))
    );

    renderizarCards(dadosFiltrados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    dados.forEach((dado, index) => {
        let article = document.createElement("article");
        article.classList.add("card");
        article.style.setProperty('--card-index', index + 1); // Define a variável CSS para o delay da animação
        article.innerHTML = `
        <div class="card-content">
            <img src="${dado.foto}" alt="Foto de ${dado.nome}" class="card-foto">
            <div class="card-info">
                <h2>${dado.nome}</h2>
                <p>${dado.equipe}</p>
                <p><strong>Pódios:</strong> ${dado.podios}</p>
            </div>
        </div>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article);
    });
}

// --- LÓGICA DO QUIZ ---

const quizContainer = document.getElementById('quiz-container');
const quizResultContainer = document.getElementById('quiz-result');

const quizPerguntas = [
    {
        pergunta: "Em uma corrida, qual é sua estratégia principal?",
        opcoes: [
            { texto: "Ataque total, arriscar tudo pela vitória.", perfil: "agressivo" },
            { texto: "Consistência e estratégia, pensando no campeonato.", perfil: "estrategista" },
            { texto: "Aprender e se adaptar, buscando a melhor posição possível.", perfil: "prodígio" },
            { texto: "Usar a experiência para superar os adversários nos momentos certos.", perfil: "veterano" }
        ]
    },
    {
        pergunta: "Seu carro não é o mais rápido do grid. O que você faz?",
        opcoes: [
            { texto: "Extraio 110% do carro, mesmo que isso signifique um ou dois toques.", perfil: "agressivo" },
            { texto: "Foco em não cometer erros e aproveito as falhas dos outros.", perfil: "estrategista" },
            { texto: "Trabalho com a equipe para encontrar um acerto inovador.", perfil: "prodígio" },
            { texto: "Defendo minha posição com unhas e dentes, mostrando minha experiência.", perfil: "veterano" }
        ]
    },
    {
        pergunta: "Qual tipo de circuito mais te agrada?",
        opcoes: [
            { texto: "Circuitos de rua apertados e desafiadores como Mônaco.", perfil: "agressivo" },
            { texto: "Pistas clássicas e de alta velocidade como Silverstone.", perfil: "estrategista" },
            { texto: "Qualquer um! Estou pronto para aprender e dominar todos.", perfil: "prodígio" },
            { texto: "Circuitos técnicos onde a experiência faz a diferença, como Spa.", perfil: "veterano" }
        ]
    },
    {
        pergunta: "O que você mais valoriza em um companheiro de equipe?",
        opcoes: [
            { texto: "Alguém rápido que me force a ser melhor a cada volta.", perfil: "agressivo" },
            { texto: "Alguém colaborativo para o bem da equipe.", perfil: "estrategista" },
            { texto: "Um piloto experiente de quem eu possa aprender.", perfil: "prodígio" },
            { texto: "Respeito mútuo dentro e fora da pista.", perfil: "veterano" }
        ]
    },
    {
        pergunta: "Fora das pistas, como você se descreveria?",
        opcoes: [
            { texto: "Focado e determinado, sempre pensando na próxima corrida.", perfil: "agressivo" },
            { texto: "Engajado em causas maiores e usando minha plataforma para o bem.", perfil: "estrategista" },
            { texto: "Tranquilo e estudioso, sempre analisando dados para melhorar.", perfil: "prodígio" },
            { texto: "Um líder natural, respeitado por todos no paddock.", perfil: "veterano" }
        ]
    }
];

let perguntaAtual = 0;
let pontuacao = { agressivo: 0, estrategista: 0, prodígio: 0, veterano: 0 };

function iniciarQuiz() {
    mostrarPergunta();
}

function mostrarPergunta() {
    const q = quizPerguntas[perguntaAtual];
    quizContainer.innerHTML = `
        <div class="quiz-question">${q.pergunta}</div>
        <div class="quiz-options">
            ${q.opcoes.map(opcao => `<button class="quiz-option" onclick="selecionarOpcao('${opcao.perfil}')">${opcao.texto}</button>`).join('')}
        </div>
    `;
}

function selecionarOpcao(perfil) {
    pontuacao[perfil]++;
    perguntaAtual++;
    if (perguntaAtual < quizPerguntas.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    const perfilVencedor = Object.keys(pontuacao).reduce((a, b) => pontuacao[a] > pontuacao[b] ? a : b);
    const mapaPilotos = {
        agressivo: "Max Verstappen",
        estrategista: "Lewis Hamilton",
        prodígio: "Oscar Piastri",
        veterano: "Fernando Alonso"
    };
    const pilotoRecomendado = dados.find(p => p.nome === mapaPilotos[perfilVencedor]);

    quizContainer.style.display = 'none';
    quizResultContainer.style.display = 'flex';

    quizResultContainer.innerHTML = `
        <h3>Seu piloto ideal é...</h3>
        <article class="card" style="opacity: 1; transform: translateY(0);">
            <div class="card-content">
                <img src="${pilotoRecomendado.foto}" alt="Foto de ${pilotoRecomendado.nome}" class="card-foto">
                <div class="card-info">
                    <h2>${pilotoRecomendado.nome}</h2>
                    <p>${pilotoRecomendado.equipe}</p>
                    <p><strong>Pódios:</strong> ${pilotoRecomendado.podios}</p>
                </div>
            </div>
            <a href="${pilotoRecomendado.link}" target="_blank">Saiba mais</a>
        </article>
    `;
}