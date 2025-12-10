// Game Data
const games = [
    { id: 'sudoku', name: 'Sudoku', icon: '🔢', description: 'Classic number puzzle game' },
    { id: 'tictactoe', name: 'Tic Tac Toe', icon: '⭕', description: 'Classic X and O game' },
    { id: 'snake', name: 'Snake', icon: '🐍', description: 'Eat and grow longer' },
    { id: 'memory', name: 'Memory Match', icon: '🎴', description: 'Find matching pairs' },
    { id: 'game2048', name: '2048', icon: '🎯', description: 'Merge tiles to reach 2048' },
    { id: 'minesweeper', name: 'Minesweeper', icon: '💣', description: 'Avoid the mines' },
    { id: 'whackamole', name: 'Whack a Mole', icon: '🐹', description: 'Hit the moles!' },
    { id: 'typing', name: 'Typing Speed', icon: '⌨️', description: 'Test your typing speed' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGames('popularGames', games.slice(0, 4));
    renderGames('allGames', games);
});

// Navigation
function showHome() {
    hideAllSections();
    document.getElementById('home').classList.remove('hidden');
}

function showGames() {
    hideAllSections();
    document.getElementById('games').classList.remove('hidden');
}

function showAbout() {
    hideAllSections();
    document.getElementById('about').classList.remove('hidden');
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
}

function backToGames() {
    hideAllSections();
    document.getElementById('games').classList.remove('hidden');
}

// Render Games
function renderGames(containerId, gameList) {
    const container = document.getElementById(containerId);
    container.innerHTML = gameList.map(game => `
        <div class="game-card" onclick="loadGame('${game.id}')">
            <div class="game-icon">${game.icon}</div>
            <h3>${game.name}</h3>
            <p>${game.description}</p>
        </div>
    `).join('');
}

// Load Game
function loadGame(gameId) {
    hideAllSections();
    document.getElementById('gameContainer').classList.remove('hidden');
    
    const gameArea = document.getElementById('gameArea');
    
    switch(gameId) {
        case 'sudoku': initSudoku(gameArea); break;
        case 'tictactoe': initTicTacToe(gameArea); break;
        case 'snake': initSnake(gameArea); break;
        case 'memory': initMemory(gameArea); break;
        case 'game2048': init2048(gameArea); break;
        case 'minesweeper': initMinesweeper(gameArea); break;
        case 'whackamole': initWhackAMole(gameArea); break;
        case 'typing': initTyping(gameArea); break;
    }
}

// ==================== SUDOKU ====================
function initSudoku(container) {
    const puzzle = generateSudoku();
    
    container.innerHTML = `
        <h2>🔢 Sudoku</h2>
        <p>Fill in the grid so every row, column, and 3x3 box contains 1-9</p>
        <div class="sudoku-container">
            <div class="sudoku-grid" id="sudokuGrid"></div>
            <div class="game-controls">
                <button class="game-btn" onclick="checkSudoku()">Check Solution</button>
                <button class="game-btn" onclick="initSudoku(document.getElementById('gameArea'))">New Game</button>
            </div>
            <p id="sudokuMessage"></p>
        </div>
    `;
    
    const grid = document.getElementById('sudokuGrid');
    for(let i = 0; i < 81; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sudoku-cell';
        input.maxLength = 1;
        input.dataset.index = i;
        
        if(puzzle[i] !== 0) {
            input.value = puzzle[i];
            input.classList.add('fixed');
            input.readOnly = true;
        }
        
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^1-9]/g, '');
        });
        
        grid.appendChild(input);
    }
    
    window.sudokuSolution = solveSudoku([...puzzle]);
}

function generateSudoku() {
    // Simple puzzle generator
    const base = [
        5,3,0,0,7,0,0,0,0,
        6,0,0,1,9,5,0,0,0,
        0,9,8,0,0,0,0,6,0,
        8,0,0,0,6,0,0,0,3,
        4,0,0,8,0,3,0,0,1,
        7,0,0,0,2,0,0,0,6,
        0,6,0,0,0,0,2,8,0,
        0,0,0,4,1,9,0,0,5,
        0,0,0,0,8,0,0,7,9
    ];
    return base;
}

function solveSudoku(puzzle) {
    // Returns solved puzzle
    const solved = [
        5,3,4,6,7,8,9,1,2,
        6,7,2,1,9,5,3,4,8,
        1,9,8,3,4,2,5,6,7,
        8,5,9,7,6,1,4,2,3,
        4,2,6,8,5,3,7,9,1,
        7,1,3,9,2,4,8,5,6,
        9,6,1,5,3,7,2,8,4,
        2,8,7,4,1,9,6,3,5,
        3,4,5,2,8,6,1,7,9
    ];
    return solved;
}

function checkSudoku() {
    const cells = document.querySelectorAll('.sudoku-cell');
    const message = document.getElementById('sudokuMessage');
    let correct = true;
    
    cells.forEach((cell, i) => {
        if(parseInt(cell.value) !== window.sudokuSolution[i]) {
            correct = false;
        }
    });
    
    message.textContent = correct ? '🎉 Congratulations! Puzzle solved!' : '❌ Not quite right, keep trying!';
    message.style.color = correct ? '#00b894' : '#e74c3c';
}

// ==================== TIC TAC TOE ====================
function initTicTacToe(container) {
    window.tttBoard = ['','','','','','','','',''];
    window.tttCurrent = 'X';
    window.tttGameOver = false;
    
    container.innerHTML = `
        <h2>⭕ Tic Tac Toe</h2>
        <p class="game-info">Player <span id="tttPlayer">X</span>'s turn</p>
        <div class="ttt-grid" id="tttGrid"></div>
        <div class="game-controls">
            <button class="game-btn" onclick="initTicTacToe(document.getElementById('gameArea'))">New Game</button>
        </div>
    `;
    
    const grid = document.getElementById('tttGrid');
    for(let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.onclick = () => tttMove(i);
        grid.appendChild(cell);
    }
}

function tttMove(index) {
    if(window.tttBoard[index] || window.tttGameOver) return;
    
    window.tttBoard[index] = window.tttCurrent;
    document.querySelectorAll('.ttt-cell')[index].textContent = window.tttCurrent;
    
    const winner = checkTTTWinner();
    if(winner) {
        document.getElementById('tttPlayer').parentElement.innerHTML = 
            winner === 'draw' ? "It's a Draw!" : `🎉 Player ${winner} Wins!`;
        window.tttGameOver = true;
        return;
    }
    
    window.tttCurrent = window.tttCurrent === 'X' ? 'O' : 'X';
    document.getElementById('tttPlayer').textContent = window.tttCurrent;
}

function checkTTTWinner() {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    
    for(let [a,b,c] of wins) {
        if(window.tttBoard[a] && window.tttBoard[a] === window.tttBoard[b] && window.tttBoard[a] === window.tttBoard[c]) {
            return window.tttBoard[a];
        }
    }
    
    if(!window.tttBoard.includes('')) return 'draw';
    return null;
}

// ==================== SNAKE ====================
function initSnake(container) {
    container.innerHTML = `
        <h2>🐍 Snake</h2>
        <p class="game-info">Score: <span id="snakeScore">0</span></p>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <div class="game-controls">
            <button class="game-btn" onclick="startSnake()">Start Game</button>
        </div>
        <p>Use Arrow Keys or WASD to move</p>
    `;
}

function startSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const size = 20;
    
    let snake = [{x: 200, y: 200}];
    let food = spawnFood();
    let dx = size, dy = 0;
    let score = 0;
    let gameLoop;
    
    function spawnFood() {
        return {
            x: Math.floor(Math.random() * 20) * size,
            y: Math.floor(Math.random() * 20) * size
        };
    }
    
    function draw() {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw snake
        ctx.fillStyle = '#00b894';
        snake.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? '#00b894' : '#55efc4';
            ctx.fillRect(segment.x, segment.y, size-2, size-2);
        });
        
        // Draw food
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x, food.y, size-2, size-2);
    }
    
    function update() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Wall collision
        if(head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
            clearInterval(gameLoop);
            alert('Game Over! Score: ' + score);
            return;
        }
        
        // Self collision
        if(snake.some(s => s.x === head.x && s.y === head.y)) {
            clearInterval(gameLoop);
            alert('Game Over! Score: ' + score);
            return;
        }
        
        snake.unshift(head);
        
        // Eat food
        if(head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById('snakeScore').textContent = score;
            food = spawnFood();
        } else {
            snake.pop();
        }
        
        draw();
    }
    
    document.onkeydown = (e) => {
        switch(e.key) {
            case 'ArrowUp': case 'w': if(dy === 0) {dx = 0; dy = -size;} break;
            case 'ArrowDown': case 's': if(dy === 0) {dx = 0; dy = size;} break;
            case 'ArrowLeft': case 'a': if(dx === 0) {dx = -size; dy = 0;} break;
            case 'ArrowRight': case 'd': if(dx === 0) {dx = size; dy = 0;} break;
        }
    };
    
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 150);
}

// ==================== MEMORY GAME ====================
function initMemory(container) {
    const emojis = ['🎮','🎲','🎯','🎪','🎨','🎭','🎪','🎯'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    window.memoryState = {
        flipped: [],
        matched: [],
        moves: 0
    };
    
    container.innerHTML = `
        <h2>🎴 Memory Match</h2>
        <p class="game-info">Moves: <span id="memoryMoves">0</span></p>
        <div class="memory-grid" id="memoryGrid"></div>
        <div class="game-controls">
            <button class="game-btn" onclick="initMemory(document.getElementById('gameArea'))">New Game</button>
        </div>
    `;
    
    const grid = document.getElementById('memoryGrid');
    cards.forEach((emoji, i) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.dataset.emoji = emoji;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    const state = window.memoryState;
    const index = parseInt(card.dataset.index);
    
    if(state.flipped.length >= 2 || state.flipped.includes(index) || state.matched.includes(index)) return;
    
    card.textContent = card.dataset.emoji;
    card.classList.add('flipped');
    state.flipped.push(index);
    
    if(state.flipped.length === 2) {
        state.moves++;
        document.getElementById('memoryMoves').textContent = state.moves;
        
        const cards = document.querySelectorAll('.memory-card');
        const [first, second] = state.flipped;
        
        if(cards[first].dataset.emoji === cards[second].dataset.emoji) {
            state.matched.push(first, second);
            cards[first].classList.add('matched');
            cards[second].classList.add('matched');
            state.flipped = [];
            
            if(state.matched.length === 16) {
                setTimeout(() => alert('🎉 You won in ' + state.moves + ' moves!'), 300);
            }
        } else {
            setTimeout(() => {
                cards[first].textContent = '';
                cards[second].textContent = '';
                cards[first].classList.remove('flipped');
                cards[second].classList.remove('flipped');
                state.flipped = [];
            }, 1000);
        }
    }
}

// ==================== 2048 ====================
function init2048(container) {
    window.grid2048 = Array(16).fill(0);
    addTile();
    addTile();
    
    container.innerHTML = `
        <h2>🎯 2048</h2>
        <p class="game-info">Score: <span id="score2048">0</span></p>
        <div class="game-2048-grid" id="grid2048"></div>
        <div class="game-controls">
            <button class="game-btn" onclick="init2048(document.getElementById('gameArea'))">New Game</button>
        </div>
        <p>Use Arrow Keys to move tiles</p>
    `;
    
    render2048();
    
    document.onkeydown = (e) => {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
            e.preventDefault();
            move2048(e.key);
        }
    };
}

function addTile() {
    const empty = window.grid2048.map((v,i) => v === 0 ? i : -1).filter(i => i >= 0);
    if(empty.length) {
        const idx = empty[Math.floor(Math.random() * empty.length)];
        window.grid2048[idx] = Math.random() < 0.9 ? 2 : 4;
    }
}

function render2048() {
    const colors = {
        0: '#cdc1b4', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
        16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72',
        256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    
    const grid = document.getElementById('grid2048');
    grid.innerHTML = window.grid2048.map(v => `
        <div class="tile-2048" style="background:${colors[v] || '#3c3a32'}; color:${v > 4 ? '#f9f6f2' : '#776e65'}">
            ${v || ''}
        </div>
    `).join('');
}

function move2048(direction) {
    let moved = false;
    const g = window.grid2048;
    
    function slide(row) {
        let arr = row.filter(v => v);
        for(let i = 0; i < arr.length - 1; i++) {
            if(arr[i] === arr[i+1]) {
                arr[i] *= 2;
                arr.splice(i+1, 1);
            }
        }
        while(arr.length < 4) arr.push(0);
        return arr;
    }
    
    if(direction === 'ArrowLeft') {
        for(let i = 0; i < 4; i++) {
            let row = [g[i*4], g[i*4+1], g[i*4+2], g[i*4+3]];
            let newRow = slide(row);
            if(JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
            [g[i*4], g[i*4+1], g[i*4+2], g[i*4+3]] = newRow;
        }
    }
    else if(direction === 'ArrowRight') {
        for(let i = 0; i < 4; i++) {
            let row = [g[i*4], g[i*4+1], g[i*4+2], g[i*4+3]].reverse();
            let newRow = slide(row).reverse();
            if(JSON.stringify([g[i*4], g[i*4+1], g[i*4+2], g[i*4+3]]) !== JSON.stringify(newRow)) moved = true;
            [g[i*4], g[i*4+1], g[i*4+2], g[i*4+3]] = newRow;
        }
    }
    else if(direction === 'ArrowUp') {
        for(let i = 0; i < 4; i++) {
            let col = [g[i], g[i+4], g[i+8], g[i+12]];
            let newCol = slide(col);
            if(JSON.stringify(col) !== JSON.stringify(newCol)) moved = true;
            [g[i], g[i+4], g[i+8], g[i+12]] = newCol;
        }
    }
    else if(direction === 'ArrowDown') {
        for(let i = 0; i < 4; i++) {
            let col = [g[i], g[i+4], g[i+8], g[i+12]].reverse();
            let newCol = slide(col).reverse();
            if(JSON.stringify([g[i], g[i+4], g[i+8], g[i+12]]) !== JSON.stringify(newCol)) moved = true;
            [g[i], g[i+4], g[i+8], g[i+12]] = newCol;
        }
    }
    
    if(moved) {
        addTile();
        render2048();
    }
}

// ==================== MINESWEEPER ====================
function initMinesweeper(container) {
    const size = 10;
    const mines = 15;
    
    window.mineGrid = Array(100).fill(0);
    window.mineRevealed = Array(100).fill(false);
    window.mineFlags = Array(100).fill(false);
    window.mineGameOver = false;
    
    // Place mines
    let placed = 0;
    while(placed < mines) {
        const idx = Math.floor(Math.random() * 100);
        if(window.mineGrid[idx] !== -1) {
            window.mineGrid[idx] = -1;
            placed++;
        }
    }
    
    // Calculate numbers
    for(let i = 0; i < 100; i++) {
        if(window.mineGrid[i] === -1) continue;
        let count = 0;
        const neighbors = getNeighbors(i, size);
        neighbors.forEach(n => {
            if(window.mineGrid[n] === -1) count++;
        });
        window.mineGrid[i] = count;
    }
    
    container.innerHTML = `
        <h2>💣 Minesweeper</h2>
        <p class="game-info">Mines: ${mines} | Right-click to flag</p>
        <div class="minesweeper-grid" id="mineGrid"></div>
        <div class="game-controls">
            <button class="game-btn" onclick="initMinesweeper(document.getElementById('gameArea'))">New Game</button>
        </div>
    `;
    
    const grid = document.getElementById('mineGrid');
    for(let i = 0; i < 100; i++) {
        const cell = document.createElement('button');
        cell.className = 'mine-cell';
        cell.dataset.index = i;
        cell.onclick = () => revealCell(i);
        cell.oncontextmenu = (e) => { e.preventDefault(); flagCell(i); };
        grid.appendChild(cell);
    }
}

function getNeighbors(idx, size) {
    const neighbors = [];
    const row = Math.floor(idx / size);
    const col = idx % size;
    
    for(let r = -1; r <= 1; r++) {
        for(let c = -1; c <= 1; c++) {
            if(r === 0 && c === 0) continue;
            const newRow = row + r;
            const newCol = col + c;
            if(newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                neighbors.push(newRow * size + newCol);
            }
        }
    }
    return neighbors;
}

function revealCell(idx) {
    if(window.mineGameOver || window.mineRevealed[idx] || window.mineFlags[idx]) return;
    
    const cells = document.querySelectorAll('.mine-cell');
    window.mineRevealed[idx] = true;
    cells[idx].classList.add('revealed');
    
    if(window.mineGrid[idx] === -1) {
        cells[idx].textContent = '💣';
        cells[idx].classList.add('mine');
        window.mineGameOver = true;
        alert('💥 Game Over!');
        return;
    }
    
    if(window.mineGrid[idx] > 0) {
        cells[idx].textContent = window.mineGrid[idx];
    } else {
        // Reveal neighbors
        getNeighbors(idx, 10).forEach(n => revealCell(n));
    }
    
    // Check win
    const unrevealed = window.mineRevealed.filter((r, i) => !r && window.mineGrid[i] !== -1).length;
    if(unrevealed === 0) {
        window.mineGameOver = true;
        alert('🎉 You won!');
    }
}

function flagCell(idx) {
    if(window.mineGameOver || window.mineRevealed[idx]) return;
    
    window.mineFlags[idx] = !window.mineFlags[idx];
    document.querySelectorAll('.mine-cell')[idx].textContent = window.mineFlags[idx] ? '🚩' : '';
}

// ==================== WHACK A MOLE ====================
function initWhackAMole(container) {
    container.innerHTML = `
        <h2>🐹 Whack a Mole</h2>
        <p class="game-info">Score: <span id="moleScore">0</span> | Time: <span id="moleTime">30</span>s</p>
        <div class="mole-grid" id="moleGrid"></div>
        <div class="game-controls">
            <button class="game-btn" onclick="startWhackAMole()">Start Game</button>
        </div>
    `;
    
    const grid = document.getElementById('moleGrid');
    for(let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'mole-hole';
        hole.dataset.index = i;
        hole.onclick = () => whackMole(i);
        grid.appendChild(hole);
    }
}

function startWhackAMole() {
    window.moleScore = 0;
    window.moleTime = 30;
    window.activeMole = -1;
    
    document.getElementById('moleScore').textContent = '0';
    document.getElementById('moleTime').textContent = '30';
    
    window.moleInterval = setInterval(showMole, 800);
    window.moleTimer = setInterval(() => {
        window.moleTime--;
        document.getElementById('moleTime').textContent = window.moleTime;
        if(window.moleTime <= 0) {
            clearInterval(window.moleInterval);
            clearInterval(window.moleTimer);
            alert('Game Over! Score: ' + window.moleScore);
        }
    }, 1000);
}

function showMole() {
    const holes = document.querySelectorAll('.mole-hole');
    holes.forEach(h => h.textContent = '');
    
    window.activeMole = Math.floor(Math.random() * 9);
    holes[window.activeMole].textContent = '🐹';
}

function whackMole(idx) {
    if(idx === window.activeMole) {
        window.moleScore++;
        document.getElementById('moleScore').textContent = window.moleScore;
        document.querySelectorAll('.mole-hole')[idx].textContent = '💫';
        window.activeMole = -1;
    }
}

// ==================== TYPING SPEED ====================
function initTyping(container) {
    const words = ['javascript', 'programming', 'keyboard', 'computer', 'developer', 
                   'function', 'variable', 'algorithm', 'database', 'interface'];
    
    container.innerHTML = `
        <h2>⌨️ Typing Speed Test</h2>
        <p class="game-info">WPM: <span id="typingWPM">0</span> | Time: <span id="typingTime">60</span>s</p>
        <p id="typingWord" style="font-size: 2rem; margin: 20px 0; color: #a29bfe;"></p>
        <input type="text" id="typingInput" class="sudoku-cell" style="width: 200px; font-size: 1.2rem;" placeholder="Type here..." disabled>
        <div class="game-controls">
            <button class="game-btn" onclick="startTyping()">Start Test</button>
        </div>
    `;
    
    window.typingWords = words;
}

function startTyping() {
    window.typingScore = 0;
    window.typingTime = 60;
    window.typingStarted = Date.now();
    
    const input = document.getElementById('typingInput');
    input.disabled = false;
    input.value = '';
    input.focus();
    
    showNewWord();
    
    input.oninput = () => {
        if(input.value.toLowerCase() === window.currentWord.toLowerCase()) {
            window.typingScore++;
            input.value = '';
            showNewWord();
            updateWPM();
        }
    };
    
    window.typingTimer = setInterval(() => {
        window.typingTime--;
        document.getElementById('typingTime').textContent = window.typingTime;
        if(window.typingTime <= 0) {
            clearInterval(window.typingTimer);
            input.disabled = true;
            alert('Test Complete! WPM: ' + document.getElementById('typingWPM').textContent);
        }
    }, 1000);
}

function showNewWord() {
    window.currentWord = window.typingWords[Math.floor(Math.random() * window.typingWords.length)];
    document.getElementById('typingWord').textContent = window.currentWord;
}

function updateWPM() {
    const elapsed = (Date.now() - window.typingStarted) / 1000 / 60;
    const wpm = Math.round(window.typingScore / elapsed);
    document.getElementById('typingWPM').textContent = wpm;
}