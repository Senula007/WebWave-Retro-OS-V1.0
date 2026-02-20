

class MinesweeperGame {
    constructor() {
        this.rows = 9;
        this.cols = 9;
        this.minesCount = 10;
        this.grid = [];
        this.gameOver = false;
        this.flagsUsed = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.firstClick = true;

        this.ui = {
            board: null,
            minesCounter: null,
            timerDisplay: null,
            faceBtn: null
        };
    }

    init() {

        this.ui.board = document.getElementById('ms-board');
        this.ui.minesCounter = document.getElementById('ms-mines-count');
        this.ui.timerDisplay = document.getElementById('ms-timer');

        if (!this.ui.board) return;

        this.resetGame();
    }

    resetGame() {
        this.stopTimer();
        this.timer = 0;
        this.updateTimerUI();
        this.gameOver = false;
        this.firstClick = true;
        this.flagsUsed = 0;
        this.updateMineCounter();

        const face = document.querySelector('.ms-face-btn');
        if (face) face.textContent = '😊';

        this.generateGrid();
        this.renderBoard();
    }

    generateGrid() {
        this.grid = [];
        for (let r = 0; r < this.rows; r++) {
            const row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push({
                    r, c,
                    isMine: false,
                    revealed: false,
                    flagged: false,
                    adjacentMines: 0
                });
            }
            this.grid.push(row);
        }
    }

    placeMines(safeR, safeC) {
        let minesPlaced = 0;
        while (minesPlaced < this.minesCount) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);

            if (!this.grid[r][c].isMine && (Math.abs(r - safeR) > 1 || Math.abs(c - safeC) > 1)) {
                this.grid[r][c].isMine = true;
                minesPlaced++;
            }
        }
        this.calculateAdjacents();
    }

    calculateAdjacents() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.grid[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
                this.grid[r][c].adjacentMines = count;
            }
        }
    }

    renderBoard() {
        this.ui.board.style.gridTemplateColumns = `repeat(${this.cols}, 24px)`;
        this.ui.board.innerHTML = '';

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'ms-cell';
                cell.dataset.r = r;
                cell.dataset.c = c;

                cell.style.width = '24px';
                cell.style.height = '24px';
                cell.style.border = '3px solid #fff';
                cell.style.borderRightColor = '#808080';
                cell.style.borderBottomColor = '#808080';
                cell.style.background = '#c0c0c0';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontWeight = 'bold';
                cell.style.fontSize = '16px';
                cell.style.cursor = 'default';
                cell.onmousedown = (e) => this.handleInput(e, r, c);
                cell.oncontextmenu = (e) => e.preventDefault();

                this.ui.board.appendChild(cell);
            }
        }
    }

    handleInput(e, r, c) {
        if (this.gameOver) return;

        if (e.button === 0) {
            this.revealCell(r, c);
        }
        else if (e.button === 2) {
            this.toggleFlag(r, c);
        }
    }

    revealCell(r, c) {
        const cellData = this.grid[r][c];
        if (cellData.revealed || cellData.flagged) return;

        if (this.firstClick) {
            this.firstClick = false;
            this.placeMines(r, c);
            this.startTimer();
        }

        cellData.revealed = true;
        this.updateCellUI(r, c);

        if (cellData.isMine) {
            this.triggerGameOver(false);
            return;
        }

        if (cellData.adjacentMines === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                        this.revealCell(nr, nc);
                    }
                }
            }
        }

        this.checkWin();
    }

    toggleFlag(r, c) {
        const cellData = this.grid[r][c];
        if (cellData.revealed) return;

        if (cellData.flagged) {
            cellData.flagged = false;
            this.flagsUsed--;
        } else {
            cellData.flagged = true;
            this.flagsUsed++;
        }
        this.updateCellUI(r, c);
        this.updateMineCounter();
    }

    updateCellUI(r, c) {
        const cell = this.ui.board.children[r * this.cols + c];
        const data = this.grid[r][c];

        if (data.revealed) {
            cell.style.border = '1px solid #808080';
            cell.style.background = '#c0c0c0';
            cell.style.borderTop = '1px solid #808080';
            cell.style.borderLeft = '1px solid #808080';

            if (data.isMine) {
                cell.style.background = 'red';
                cell.textContent = '💣';
            } else if (data.adjacentMines > 0) {
                cell.textContent = data.adjacentMines;
                cell.style.color = this.getNumberColor(data.adjacentMines);
            }
        } else if (data.flagged) {
            cell.textContent = '🚩';
        } else {
            cell.textContent = '';
        }
    }

    getNumberColor(n) {
        const colors = ['blue', 'green', 'red', 'darkblue', 'brown', 'cyan', 'black', 'gray'];
        return colors[n - 1] || 'black';
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerUI();
            if (this.timer > 999) this.stopTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    updateTimerUI() {
        if (this.ui.timerDisplay) {
            this.ui.timerDisplay.textContent = this.timer.toString().padStart(3, '0');
        }
    }

    updateMineCounter() {
        const remaining = this.minesCount - this.flagsUsed;
        if (this.ui.minesCounter) {
            this.ui.minesCounter.textContent = remaining.toString().padStart(3, '0');
        }
    }

    triggerGameOver(win) {
        this.gameOver = true;
        this.stopTimer();
        const face = document.querySelector('.ms-face-btn');

        if (win) {
            face.textContent = '😎';
            this.flagAllMines();
        } else {
            face.textContent = '😵';
            this.revealAllMines();
        }
    }

    checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].revealed) revealedCount++;
            }
        }
        if (revealedCount === (this.rows * this.cols - this.minesCount)) {
            this.triggerGameOver(true);
        }
    }

    revealAllMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) {
                    this.grid[r][c].revealed = true;
                    this.updateCellUI(r, c);
                }
            }
        }
    }

    flagAllMines() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine && !this.grid[r][c].flagged) {
                    this.grid[r][c].flagged = true;
                    this.updateCellUI(r, c);
                }
            }
        }
    }
}

window.initMinesweeper = () => {
    window.minesweeperInstance = new MinesweeperGame();
    window.minesweeperInstance.init();
};
