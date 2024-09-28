const grid = document.getElementById('grid');
const mensagem = document.getElementById('mensagem');
const naviosRestantesSpan = document.getElementById('navios-restantes');
const bombaBtn = document.getElementById('bomba-btn');

const letras = 'ABCDEFGHIJKLMNO'; // Letras para o tabuleiro
const tamanhoTabuleiro = 15; // Tabuleiro 15x15
const navios = [
    { tamanho: 5, afundado: false },
    { tamanho: 4, afundado: false },
    { tamanho: 3, afundado: false },
    { tamanho: 3, afundado: false },
    { tamanho: 2, afundado: false },
    { tamanho: 1, afundado: false }
];

let naviosRestantes = navios.length;
let bombaUsada = false;

naviosRestantesSpan.textContent = naviosRestantes;

// Função para criar o tabuleiro
function criarTabuleiro() {
    // Criar letras no topo
    const labelsTop = document.querySelector('.labels-top');
    for (let i = 0; i < tamanhoTabuleiro; i++) {
        const label = document.createElement('div');
        label.classList.add('label');
        label.textContent = letras[i];
        labelsTop.appendChild(label);
    }

    // Criar números à esquerda
    const labelsLeft = document.querySelector('.labels-left');
    for (let i = 1; i <= tamanhoTabuleiro; i++) {
        const label = document.createElement('div');
        label.classList.add('label');
        label.textContent = i;
        labelsLeft.appendChild(label);
    }

    // Criar células no grid
    for (let i = 0; i < tamanhoTabuleiro * tamanhoTabuleiro; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.id = i;
        grid.appendChild(cell);
    }
}

// Função para posicionar navios
function posicionarNavios() {
    navios.forEach((navio) => {
        let posicionado = false;
        while (!posicionado) {
            const horizontal = Math.random() < 0.5; // Aleatoriamente escolhe entre horizontal e vertical
            const x = Math.floor(Math.random() * tamanhoTabuleiro);
            const y = Math.floor(Math.random() * tamanhoTabuleiro);
            const posicoes = [];

            for (let i = 0; i < navio.tamanho; i++) {
                const novaX = horizontal ? x + i : x;
                const novaY = horizontal ? y : y + i;

                if (novaX >= tamanhoTabuleiro || novaY >= tamanhoTabuleiro) {
                    posicoes.length = 0; // Se for fora do tabuleiro, recomeça
                    break;
                }

                const indice = novaY * tamanhoTabuleiro + novaX;
                if (grid.children[indice].classList.contains('barco')) {
                    posicoes.length = 0; // Se houver um navio, recomeça
                    break;
                }

                posicoes.push(indice);
            }

            if (posicoes.length === navio.tamanho) {
                posicoes.forEach((indice) => grid.children[indice].classList.add('barco'));
                posicionado = true;
            }
        }
    });
}

// Função para lidar com clique normal
function lidarComCliqueNormal(cell) {
    if (cell.classList.contains('barco')) {
        cell.classList.add('tocado');
        mensagem.textContent = 'Você acertou um navio!';
        verificarNavioAfundado();
    } else {
        cell.classList.add('miss');
        mensagem.textContent = 'Água!';
    }
}

// Função para verificar se o navio foi afundado
function verificarNavioAfundado() {
    const partes = document.querySelectorAll('.barco.tocado');
    const totalPartes = navios.reduce((total, navio) => total + navio.tamanho, 0);

    if (partes.length === totalPartes) {
        naviosRestantes--;
        naviosRestantesSpan.textContent = naviosRestantes;
        mensagem.textContent = 'Você afundou um navio!';
    }

    if (naviosRestantes === 0) {
        mensagem.textContent = 'Parabéns! Você afundou todos os navios!';
        grid.removeEventListener('click', lidarComClique);
    }
}

// Função para usar a bomba
function usarBomba(cellIndex) {
    const x = cellIndex % tamanhoTabuleiro;
    const y = Math.floor(cellIndex / tamanhoTabuleiro);

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const novaX = x + i;
            const novaY = y + j;

            if (novaX >= 0 && novaX < tamanhoTabuleiro && novaY >= 0 && novaY < tamanhoTabuleiro) {
                const indice = novaY * tamanhoTabuleiro + novaX;
                const cell = grid.children[indice];

                if (!cell.classList.contains('tocado') && !cell.classList.contains('miss')) {
                    lidarComCliqueNormal(cell);
                }
            }
        }
    }

    bombaUsada = true;
    bombaBtn.disabled = true;
    bombaBtn.textContent = 'Bomba Usada!';
}

// Inicializar o jogo
criarTabuleiro();
posicionarNavios();

// Evento de clique nas células
grid.addEventListener('click', (e) => {
    if (!e.target.classList.contains('cell')) return;

    const cell = e.target;

    // Verificar se a célula já foi clicada
    if (cell.classList.contains('tocado') || cell.classList.contains('miss')) {
        mensagem.textContent = 'Você já clicou nesta posição!';
        return;
    }

    lidarComCliqueNormal(cell);
});

// Evento para usar a bomba
bombaBtn.addEventListener('click', () => {
    grid.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cell')) return;

        const cellIndex = parseInt(e.target.dataset.id);
        if (!bombaUsada) {
            usarBomba(cellIndex);
        }
    }, { once: true });
});