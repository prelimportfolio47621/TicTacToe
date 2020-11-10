//Background and animation

const main = document.querySelector('.main');
const toggleBtn = document.querySelector('.toggle-animation');
const animationMask = document.getElementById('animation-mask');
let animationOn = true;

const colors = [
    '2196f3',
    'e91e63',
    'ffeb3b',
    '74ff1d'
];

function createLetters() {
    const letter = document.createElement('span');
    const fontSize = 20 + Math.floor(Math.random() * 30);

    letter.innerHTML = Math.random() < 0.5 ? 'X' : 'O';

    letter.style.fontSize = fontSize + 'px';

    letter.style.top = (Math.floor(Math.random() * window.innerHeight) * 0.9) + 'px';
    letter.style.left = (Math.floor(Math.random() * window.innerWidth) * 0.9) + 'px';

    const bg = colors[Math.floor(Math.random() * colors.length)];
    letter.style.color = `#${bg}`;
    
    letter.className = 'letter';
    main.appendChild(letter);

    setTimeout(() => {
        letter.remove();
    }, 5000);
}

let intervalID;

function startAnimation() {
    intervalID = setInterval(createLetters, 150);
    animationMask.style.visibility = 'hidden';
    toggleBtn.innerHTML = 'Disable Animation';
}

function disableAnimation() {
    clearInterval(intervalID);
    animationMask.style.visibility = 'visible';
    toggleBtn.innerHTML = 'Turn On Animation';
}

function toggleAnimation() {
    animationOn ? disableAnimation() : startAnimation();
    animationOn = !animationOn;
}

toggleBtn.addEventListener('click', toggleAnimation);

startAnimation();


//Game logic

const board = document.getElementById('board');
const cellElements = document.querySelectorAll('[data-cell]');
const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
let circleTurn;
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const gameOver = document.querySelector('.game-over');
const winningMessage = document.getElementById('winning-message');
const restartButton = document.getElementById('restart');

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(CIRCLE_CLASS) || cell.classList.contains(X_CLASS);
    })
}

function endGame(draw) {
    if (draw) {
        winningMessage.innerHTML = 'Draw!';
    } else {
        winningMessage.innerHTML = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    gameOver.classList.add('show');
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    circleTurn ? board.classList.add(CIRCLE_CLASS) : board.classList.add(X_CLASS);
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    };
}

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    gameOver.classList.remove('show');
}

restartButton.addEventListener('click', startGame);

startGame();