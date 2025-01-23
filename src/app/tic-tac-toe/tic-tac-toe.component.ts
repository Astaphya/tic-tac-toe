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
    'assets/images/1.png',
    'assets/images/2.png',
    'assets/images/3.png',
    'assets/images/4.png',
    'assets/images/5.png',
    'assets/images/6.png',
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
    this.board = Array(9).fill('closed');  // Set all cells to 'closed'
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
    if (this.currentPlayer === 'O' || this.gameOver) {
      return; // Prevent user from making a move if it's the bot's turn or the game is over
    }
  
    if (this.board[index] === 'closed') {
      // Clear the 'closed' placeholder on first move
      this.board = Array(9).fill('');
    }
  
    if (!this.board[index]) {
      this.board[index] = this.currentPlayer;
      this.checkWinner();
  
      if (!this.gameOver) {
        this.currentPlayer = 'O';
        setTimeout(() => this.botMove(), 500);  // Delay for better UX
      }
    }
  }
  

  botMove(): void {
    const emptyIndexes = this.board
      .map((value, index) => (value === '' ? index : null))
      .filter((index) => index !== null) as number[];
  
    if (emptyIndexes.length > 0) {
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      this.board[randomIndex] = 'O';
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
