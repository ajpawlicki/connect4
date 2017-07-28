'use strict';
const prompt = require('readline-sync');

class Connect4 {
  constructor() {
    this.board = [];
    this.rows = 6;
    this.cols = 7;
    this.currPlayer = '1';
    this.moves = 0;
  }
  
  initBoard() {
    for (let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.cols; j++) {
        this.board[i][j] = null;
      }
    }
  }

  printBoard() {
    this.board.forEach((row, index) => {
      console.log(row.map(cell => {
        if (cell === null) return ' ';
        return cell;
      }).join(' | '));
    });
    console.log('_________________________');
    console.log([0,1,2,3,4,5,6].join(' | '));
  }

  placePiece(col) {
    let isOutsideColRange = col < 0 || col > this.cols - 1;
    let colIsFilled = this.board[0][col] !== null;
    let isNotNum = isNaN(col);
    let isEmptyString = col.trim() === '';

    if (isOutsideColRange || colIsFilled || isNotNum || isEmptyString) {
      return null;
    }

    const colNumber = Number(col);

    for (let i = 0; i < this.rows; i++) {
      if (i + 1 === this.rows || this.board[i+1][colNumber] !== null) {
        this.board[i][colNumber] = this.currPlayer;

        return [i, colNumber];
      }
    }
  }

  switchPlayer() {
    this.currPlayer = this.currPlayer === '1' ? '2' : '1';
  }

  checkAllAreEqual(a,b,c,d) {
    return a === b && b === c && c === d;
  }

  checkColsForWinner(move) {
    let [row, col] = move;
    if (row <= 2) {
      return this.checkAllAreEqual(this.board[row][col], this.board[row+1][col],
        this.board[row+2][col], this.board[row+3][col]);
    }
    return false;
  }

  checkRowsForWinner(move) {
    let [row, col] = move;
    let count = 0;

    for (let i = 0; i < this.cols; i++) {
      if (this.board[row][i] === this.board[row][col]) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }
    }

    return false;
  }

  checkDownRightDiagonal(move) {
    let [row, col] = move;

    // starting at top left most point of diagonal
    let rowIndex = Math.max(0, row - col);
    let colIndex = Math.max(0, col - row);
    let count = 0;

    while (rowIndex < this.rows && colIndex < this.cols) {
      if (this.board[rowIndex][colIndex] === this.board[row][col]) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }

      rowIndex++;
      colIndex++;
    }

    return false;
  }

  checkDownLeftDiagonal(move) {
    let [row, col] = move;

    // starting at top right most point of diagonal
    let rowIndex = Math.max(0, row + col - 6);
    let colIndex = Math.min(6, col + row);
    let count = 0;
    
    while (rowIndex < this.rows && colIndex >= 0) {
      if (this.board[rowIndex][colIndex] === this.board[row][col]) {
        count++;
        if (count === 4) return true;
      } else {
        count = 0;
      }

      rowIndex++;
      colIndex--;
    }

    return false;
  }

  checkForWinner(move) {
    return this.checkColsForWinner(move) || this.checkRowsForWinner(move) ||
      this.checkDownLeftDiagonal(move) || this.checkDownRightDiagonal(move);
  }

  promptPlayerMove() {
    return prompt.question(`Player ${this.currPlayer}, what is your move? Choose a column! `);
  }

  play() {
    this.printBoard();
    let col = this.promptPlayerMove();
    let move = this.placePiece(col);

    if (move === null) console.log('That is an invalid move. Please choose again!');

    let isWinner;
    if (move !== null) {
      this.moves++;
      isWinner = this.checkForWinner(move);
      this.switchPlayer();
    }

    if (isWinner === true) {
      this.switchPlayer();
      console.log(`Game over! Player ${this.currPlayer} wins!`);
      this.printBoard();
    }

    if (isWinner === false && this.moves === 42) {
      console.log('Game over. It is a draw.');
      this.printBoard();
    }

    if (isWinner !== true && this.moves < 42) {
      this.play();  
    }

  }
}

const game = new Connect4();
game.initBoard();
game.play();