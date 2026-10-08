let cellFilled;
let huPlayer = 'X';
let aiPlayer = 'O';
let level = 'easy';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2],
]
let isGameStarted=false;
const message = document.getElementById('message');
const square = document.querySelectorAll('.square');
square.forEach(cell => {
    cell.classList.add('disabled');
    cell.addEventListener('click', turnClick);
})
const switchBtn = document.getElementById('switch');
let playerChoice = document.getElementById('player-choice');
const startBtn = document.getElementById('start');
const levelBtn = document.getElementById('level');
const resetBtn = document.getElementById('reset');
const bgMusic = document.getElementById('bg-music');
bgMusic.volume = 0.3; // Atur volume (0.0 sampai 1.0)
// Otomatis putar musik pada klik PERTAMA di mana saja di layar
document.addEventListener('click', function playAudioAutomatically() {
    bgMusic.play().then(() => {
        console.log("Musik otomatis menyala!");
    }).catch(error => {
        console.log("Audio gagal diputar:", error);
    });
}, { once: true }); // { once: true } memastikan perintah ini cuma jalan 1x saja
switchBtn.addEventListener('click', () => {
    switchPlayer();
});
startBtn.addEventListener('click', () => {
    startGame();
});
resetBtn.addEventListener('click', () => {
    resetGame();
});
levelBtn.addEventListener('click',()=>{
    switchLevel();
}
)
function switchPlayer() {
    if(!isGameStarted){
        if (huPlayer === 'X') {
        huPlayer = 'O';
        aiPlayer = 'X';
        playerChoice.innerHTML=`<p>Player is "${huPlayer}", level is ${level}</p>`;
        } else {
        huPlayer = 'X';
        aiPlayer = 'O';
        playerChoice.innerHTML=`<p>Player is "${huPlayer}", level is ${level}</p>`;
        }
    }
}
function switchLevel(){
    if(level==='easy'){
        level='normal';
    }else if(level==='normal'){
        level='impossible';
    }else if(level==='impossible'){
        level='easy';
    }playerChoice.innerHTML=`<p>Player is "${huPlayer}", level is ${level}</p>`;
}
function startGame(){
    square.forEach(cell => {
    cell.classList.remove('disabled');
})
    isGameStarted = true;
    switchBtn.disabled = true;
    levelBtn.disabled=true;
    message.innerHTML = `<p>Game started!</p>`;
    startBtn.disabled=true;
    cellFilled = Array.from(Array(9).keys());

    if (aiPlayer === 'X') {
        setTimeout(() => {
            turn(aiChoice(), aiPlayer);
        }, 400);
    }
}

function resetGame(){
    square.forEach(cell => {
    cell.classList.add('disabled');
    cell.style.backgroundColor='var(--screen-color)';
    cell.innerText = ''; 
    })
    isGameStarted=false;
    startBtn.disabled=false;
    switchBtn.disabled=false;
    levelBtn.disabled=false;
    huPlayer='X';
    aiPlayer='O';
    message.innerHTML=`<p>Start the game by pressing the start button!</p>`;
    playerChoice.innerHTML=`<p>Player is "${huPlayer}", level is ${level}</p>`;
}

function turnClick(e){
    const squareId = parseInt(e.target.id);
    if (isGameStarted && typeof cellFilled[squareId] === 'number') {
        turn(squareId, huPlayer);
        if (isGameStarted && !checkTie()) {
            setTimeout(() => {
                turn(aiChoice(), aiPlayer);
            }, 400);
        }
    }
}

function turn(squareId, player) {
	cellFilled[squareId] = player;
	const selectedCell = document.getElementById(squareId);
    selectedCell.innerText = player;
    selectedCell.classList.add('disabled');
    let gameWon = checkWin(cellFilled, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        const hasWon = win.every(position => board[position] === player);
        if (hasWon) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}
function gameOver(gameWon) {
    isGameStarted = false;
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 'rgba(255, 215, 0, 0.6)';
    }
    square.forEach(cell => {
        cell.classList.add('disabled');
    });
    const winnerText = gameWon.player === huPlayer ? "You Win!" : "AI Wins!";
    message.innerHTML = `<p>${winnerText}</p>`;
}
function emptySquares() {
    return cellFilled.filter(spot => typeof spot === 'number');
}
function aiChoice() {
    return emptySquares()[0];
}
function checkTie() {
    if (emptySquares().length === 0) {
        isGameStarted = false;
        square.forEach(cell => {
            cell.classList.add('disabled');
        });
        message.innerHTML = `<p>Tie Game!</p>`;
        return true;
    }
    return false;
}