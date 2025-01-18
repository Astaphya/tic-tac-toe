import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor,NgClass],
})
export class TicTacToeComponent {
  board: string[] = Array(9).fill('');
  currentPlayer: string = 'X';
  playerImage = '';
  botImage = '';
  gameOver = false;
  winner: string | null = null;

  images = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/3.jpg',
    'assets/images/4.jpg',
    'assets/images/5.jpg',
    'assets/images/6.jpg',
  ];

  // Audio objects
  private mainTheme?: HTMLAudioElement;
  private playerWinSound?: HTMLAudioElement;
  private botWinSound?: HTMLAudioElement;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // this.initializeSounds();
    }
    this.startGame();
  }

  // initializeSounds(): void {
  //   this.playerWinSound = new Audio('assets/images/sounds/winner.mp3');
  //   this.mainTheme.loop = true;
  // }

  startGame(): void {
    this.shuffleImages();
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winner = null;

    this.playMainTheme();
  }

  shuffleImages(): void {
    const shuffled = [...this.images].sort(() => Math.random() - 0.5);
    this.playerImage = shuffled[0];
    this.botImage = shuffled[1];
  }

  makeMove(index: number): void {
    if (!this.board[index] && !this.gameOver) {
      this.board[index] = this.currentPlayer;
      this.checkWinner();

      if (!this.gameOver) {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        if (this.currentPlayer === 'O') this.botMove();
      }
    }
  }

  botMove(): void {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    // Helper function to find a move based on a condition
    const findMove = (player: string): number | null => {
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (this.board[a] === player && this.board[b] === player && !this.board[c]) {
          return c;
        }
        if (this.board[a] === player && this.board[c] === player && !this.board[b]) {
          return b;
        }
        if (this.board[b] === player && this.board[c] === player && !this.board[a]) {
          return a;
        }
      }
      return null;
    };
  
    // Random chance to prioritize a non-optimal move (40%)
    if (Math.random() < 0.4) {
      const emptyIndexes = this.board
        .map((value, index) => (value === '' ? index : null))
        .filter((index) => index !== null) as number[];
      if (emptyIndexes.length > 0) {
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
        this.board[randomIndex] = 'O';
        this.checkWinner();
        this.currentPlayer = 'X';
        return;
      }
    }
  
    // Check for a winning move for the bot
    let move = findMove('O');
    if (move !== null) {
      this.board[move] = 'O';
      this.checkWinner();
      this.currentPlayer = 'X';
      return;
    }
  
    // Block the player's winning move
    move = findMove('X');
    if (move !== null) {
      this.board[move] = 'O';
      this.checkWinner();
      this.currentPlayer = 'X';
      return;
    }
  
    // Take the center if available
    if (!this.board[4]) {
      this.board[4] = 'O';
      this.checkWinner();
      this.currentPlayer = 'X';
      return;
    }
  
    // Take an edge if available
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter((index) => !this.board[index]);
    if (availableEdges.length > 0) {
      move = availableEdges[Math.floor(Math.random() * availableEdges.length)];
      this.board[move] = 'O';
      this.checkWinner();
      this.currentPlayer = 'X';
      return;
    }
  
    // Take a random available position
    const emptyIndexes = this.board
      .map((value, index) => (value === '' ? index : null))
      .filter((index) => index !== null) as number[];
    if (emptyIndexes.length > 0) {
      move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      this.board[move] = 'O';
      this.checkWinner();
      this.currentPlayer = 'X';
    }
  }
  
  
  

  winningCells: number[] = []; // Store indices of the winning cells

  checkWinner(): void {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.gameOver = true;
        this.winningCells = [a, b, c]; // Store winning cells
  
        if (this.winner === 'X') {
          this.playPlayerWinSound();
          setTimeout(() => alert('Player Wins! 🎉'), 100);
        } else if (this.winner === 'O') {
          this.playBotWinSound();
          setTimeout(() => alert('Bot Wins! 🤖'), 100);
        }
        return;
      }
    }
  
    if (!this.board.includes('')) {
      this.gameOver = true;
      this.stopAllSounds();
      setTimeout(() => alert('It\'s a Draw!'), 100);
    }
  }
  
  
  resetGame(): void {
    this.startGame();
  }

  // Sound Functions
  playMainTheme(): void {
    this.stopAllSounds();
    if (this.mainTheme) {
      this.mainTheme.play();
    }
  }

  playPlayerWinSound(): void {
    this.stopAllSounds();
    if (this.playerWinSound) {
      this.playerWinSound.play();
    }
  }

  playBotWinSound(): void {
    this.stopAllSounds();
    if (this.botWinSound) {
      this.botWinSound.play();
    }
  }

  stopAllSounds(): void {
    [this.mainTheme, this.playerWinSound, this.botWinSound].forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }
}
