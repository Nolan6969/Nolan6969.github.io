// Inicializar tabuleiros vazios com 10 barcos
let board1 = Array(10).fill(null).map(() => Array(10).fill(0));
let board2 = Array(10).fill(null).map(() => Array(10).fill(0));

let numBombs1 = 2;
let numBombs2 = 2;
let currentTeam = 1;
let team1Name = "";
let team2Name = "";

// Função para iniciar o jogo
document.getElementById('startGame').addEventListener('click', function () {
    team1Name = document.getElementById('team1Name').value || "Grupo 1";
    team2Name = document.getElementById('team2Name').value || "Grupo 2";
    
    document.getElementById('team1Title').textContent = team1Name;
    document.getElementById('team2Title').textContent = team2Name;
    document.getElementById('currentTeam').textContent = `Grupo Atual: ${team1Name}`;
    
    document.querySelector('.setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    
    criarTabuleiros();
    posicionarBarcos(board1);
    posicionarBarcos(board2);
});

// Função para criar os tabuleiros
function criarTabuleiros() {
    const board1El = document.getElementById('board1');
    const board2El = document.getElementById('board2');
    criarTabuleiro(board1El, board1, 1);
    criarTabuleiro(board2El, board2, 2);
}

// Função para gerar o tabuleiro em HTML
function criarTabuleiro(elemento, board, numBoard) {
    for (let i = 0; i < 10; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.addEventListener('click', function () {
                fazerJogada(i, j, board, numBoard);
            });
            row.appendChild(cell);
        }
        elemento.appendChild(row);
    }
}

// Função para posicionar 10 barcos no tabuleiro
function posicionarBarcos(board) {
    let barcosPosicionados = 0;
    while (barcosPosicionados < 10) {
        const i = Math.floor(Math.random() * 10);
        const j = Math.floor(Math.random() * 10);
        if (board[i][j] === 0) {
            board[i][j] = 1; // Posiciona o barco
            barcosPosicionados++;
        }
    }
}

// Função para controlar o clique do jogador
function fazerJogada(i, j, board, numBoard) {
    const currentBombs = currentTeam === 1 ? numBombs1 : numBombs2;
    const bombButton = document.getElementById('useBomb');
    bombButton.style.display = currentBombs > 0 ? 'block' : 'none';

    if (board[i][j] === 2) {
        alert("Você já jogou aqui!");
        return;
    }

    const cell = document.querySelector(`#board${numBoard} tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
    if (board[i][j] === 1) { // Acertou um barco
        cell.classList.add('hit');
        cell.textContent = 'X'; // Exibe um X no acerto
        board[i][j] = 2;
        alert("Acertou um barco!");
    } else { // Errou
        cell.classList.add('miss');
        cell.textContent = 'O'; // Exibe um O no erro
        board[i][j] = 2;
        alert("Errou!");
    }

    trocarEquipe();
}

// Função para alternar entre equipes
function trocarEquipe() {
    currentTeam = currentTeam === 1 ? 2 : 1;
    const currentTeamName = currentTeam === 1 ? team1Name : team2Name;
    document.getElementById('currentTeam').textContent = `Grupo Atual: ${currentTeamName}`;
}

// Função para usar uma bomba (acerta toda a linha)
document.getElementById('useBomb').addEventListener('click', function () {
    const currentBombs = currentTeam === 1 ? numBombs1 : numBombs2;
    if (currentBombs <= 0) {
        alert("Você não tem mais bombas!");
        return;
    }

    const linha = prompt("Digite a linha (1-10) para usar a bomba:");
    const numLinha = parseInt(linha) - 1;

    if (isNaN(numLinha) || numLinha < 0 || numLinha >= 10) {
        alert("Linha inválida!");
        return;
    }

    const board = currentTeam === 1 ? board2 : board1;
    const table = currentTeam === 1 ? document.getElementById('board2') : document.getElementById('board1');
    
    for (let j = 0; j < 10; j++) {
        const cell = table.querySelector(`tr:nth-child(${numLinha + 1}) td:nth-child(${j + 1})`);
        if (board[numLinha][j] === 1) {
            cell.classList.add('hit');
            cell.textContent = 'X';
            board[numLinha][j] = 2;
        } else if (board[numLinha][j] === 0) {
            cell.classList.add('miss');
            cell.textContent = 'O';
            board[numLinha][j] = 2;
        }
    }

    if (currentTeam === 1) {
        numBombs1--;
        document.getElementById('bombsTeam1').textContent = numBombs1;
    } else {
        numBombs2--;
        document.getElementById('bombsTeam2').textContent = numBombs2;
    }

    trocarEquipe();
});