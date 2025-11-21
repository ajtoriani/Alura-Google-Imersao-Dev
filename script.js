let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector(".busca");
let imgBanner = document.querySelector(".imgbanner"); // Seleciona o elemento do banner
let statsContainer = document.querySelector(".stats");
let dados = [];

campoBusca.addEventListener("input", iniciarBusca);
document.addEventListener("DOMContentLoaded", () => {
    // Animações de entrada com GSAP
    gsap.from(".title", { duration: 1, y: -50, opacity: 0, ease: "power3.out" });
    gsap.from(".subtitle", { duration: 1, y: -30, opacity: 0, delay: 0.3, ease: "power3.out" });
    gsap.from(".busca-container", { duration: 1, y: 50, opacity: 0, delay: 0.6, ease: "back.out(1.7)" });
    gsap.from(".imgbanner", { duration: 1.5, scale: 0.8, opacity: 0, delay: 1, ease: "elastic.out(1, 0.5)" });

    iniciarBusca();
});

function calcularEstatisticas(dados) {
    const totalPilotos = dados.length;
    const totalPodios = dados.reduce((acc, piloto) => acc + parseInt(piloto.podios), 0);
    const equipes = new Set(dados.map(piloto => piloto.equipe));
    const totalEquipes = equipes.size;

    statsContainer.innerHTML = `
        <div class="stat-item"><h3>${totalPilotos}</h3><p>Pilotos</p></div>
        <div class="stat-item"><h3>${totalEquipes}</h3><p>Equipes</p></div>
        <div class="stat-item"><h3>${totalPodios.toLocaleString('pt-BR')}</h3><p>Pódios Combinados</p></div>
    `;

    // Animação para os stats
    gsap.from(".stat-item", { duration: 0.8, y: 30, opacity: 0, stagger: 0.2, delay: 1.2, ease: "power3.out" });
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
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
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
    }

    // Animação de entrada dos cards com GSAP
    gsap.from(".card", {
        duration: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.1, // Cria um efeito cascata
        ease: "power2.out"
    });
}