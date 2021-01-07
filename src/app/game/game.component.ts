import { Component, OnInit, ViewChild } from '@angular/core';
import { generateStartingGameState, throwDice, moveStone, placeStoneOnBoard, getPossibleMoveSquareIndexes, nthSquare, canPlaceStoneOnBoard, hasPlayerWon } from 'src/model/src/Game';
import { GameState, Player } from 'src/model/src/GameState';
import { delay } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  gameState: GameState;
  diceRoll: number;
  gameStateHistory: GameState[] = [];

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.gameState = generateStartingGameState();
    this.gameStateHistory.push(this.gameState);
  }

  skipTurn(): void {
    this.placeAIStone();
    this.enableDiceRollButton();
  }

  canSkipTurn(): boolean {
    if (this.diceRoll === 0) {
      return true;
    } else if (getPossibleMoveSquareIndexes(this.gameState, this.gameState.player, this.diceRoll).length === 0
      && canPlaceStoneOnBoard(this.gameState, this.gameState.player, this.diceRoll) === false) {
      return true;
    }
    return false;
  }

  throwDice(): void {
    this.diceRoll = throwDice();
    this.disableDiceRollButton();

    if (!this.canSkipTurn()) {
      this.enablePlaceStoneOnBoardButton();
    }
  }

  placeStone(): boolean {
    let isAITurn = true;

    const gameStateAfter = placeStoneOnBoard(this.gameState, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.disablePlaceStoneOnBoardButton();
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      this.renderGameState();

      if (nthSquare(gameStateAfter.board, gameStateAfter.player.stoneColor, this.diceRoll).special) {
        isAITurn = false;
      }
      if (isAITurn) {
        setTimeout(() => {
          this.placeAIStone();

          this.enableDiceRollButton();
          this.diceRoll = 0;
        },
          1000);
      }
      else {
        this.enableDiceRollButton();
        this.diceRoll = 0;
      }
      return true;
    }

    return false;
  }

  moveStone(squareNumber: number): boolean {
    const startSquare = this.convertSquareNumberToNthSquareOfPlayer(squareNumber, this.gameState.player);

    const gameStateAfter = moveStone(this.gameState, startSquare, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.disablePlaceStoneOnBoardButton();
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      if (hasPlayerWon(gameStateAfter.player)) {
        this.navigateToEndscreen(true);
        return true;
      }

      this.renderGameState();
      const endSquare = startSquare + this.diceRoll;

      if (!nthSquare(gameStateAfter.board, gameStateAfter.player.stoneColor, endSquare).special) {
        setTimeout(() => {
          this.placeAIStone();

          this.enableDiceRollButton();
          this.diceRoll = 0;
        },
          1000);
      }
      else {
        this.enableDiceRollButton();
        this.diceRoll = 0;
      }

      return true;
    }
    return false;
  }

  navigateToEndscreen(hasWon: boolean): void {
    if (hasWon) {
      this.router.navigateByUrl('endscreen', { state: { message: "Good job! You won!" } });
    } else {
      this.router.navigateByUrl('endscreen', { state: { message: "Noob." } });
    }
  }

  placeAIStone(): void {
    this.diceRoll = throwDice();
    const gameStateAfter = placeStoneOnBoard(this.gameState, this.gameState.ai, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      if (hasPlayerWon(gameStateAfter.ai)) {
        this.navigateToEndscreen(false);
        return;
      }
      this.renderGameState();

      if (nthSquare(gameStateAfter.board, gameStateAfter.ai.stoneColor, this.diceRoll).special) {
        setTimeout(() => {
          this.placeAIStone();
        },
          1000);
      }
    }
    else {
      this.moveAIStone();
    }

    this.diceRoll = 0;
  }

  async delay(ms: number): Promise<void> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log("fired"));
  }

  moveAIStone(): void {
    this.diceRoll = throwDice();
    const possibleMoveSquareIndexes = getPossibleMoveSquareIndexes(this.gameState, this.gameState.ai, this.diceRoll);

    if (possibleMoveSquareIndexes.length !== 0) {
      const gameStateAfter = moveStone(this.gameState, possibleMoveSquareIndexes[0], this.gameState.ai, this.diceRoll);
      if (gameStateAfter != null) {
        this.gameStateHistory.push(gameStateAfter);
        this.gameState = gameStateAfter;

        if (hasPlayerWon(gameStateAfter.ai)) {
          this.navigateToEndscreen(false);
        }

        this.renderGameState();

        if (nthSquare(gameStateAfter.board, gameStateAfter.ai.stoneColor, possibleMoveSquareIndexes[0] + this.diceRoll).special) {
          this.placeAIStone();
        }
      }
    }
  }

  convertSquareNumberToNthSquareOfPlayer(squareNumber, playerToMove): number {
    if (playerToMove === this.gameState.player) {
      if (squareNumber <= 3) {
        return squareNumber + 1;
      }
      else if (squareNumber >= 8 && squareNumber <= 18) {
        return squareNumber - 3;
      }
    }
    if (playerToMove === this.gameState.ai) {
      if (squareNumber > 3 && squareNumber <= 15) {
        return squareNumber - 3;
      }
      else if (squareNumber > 18 && squareNumber <= 21) {
        return squareNumber - 6;
      }
    }
  }

  disableDiceRollButton(): void {
    if (!document.getElementsByClassName("throwDice")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("throwDice")[0].setAttribute("disabled", "disabled");
    }
  }

  enableDiceRollButton(): void {
    if (document.getElementsByClassName("throwDice")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("throwDice")[0].removeAttribute("disabled");
    }
  }

  disablePlaceStoneOnBoardButton(): void {
    if (!document.getElementsByClassName("placeStone")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("placeStone")[0].setAttribute("disabled", "disabled");
    }
  }

  enablePlaceStoneOnBoardButton(): void {
    if (document.getElementsByClassName("placeStone")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("placeStone")[0].removeAttribute("disabled");
    }
  }

  downloadJSON(): void {
    const downloadableJSON = JSON.stringify(this.gameState);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", "data:text/json;charset=UTF-8," + encodeURIComponent(downloadableJSON));
    downloadAnchorNode.setAttribute("download", "gamestate.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  loadgame(): void {
    document.getElementById('upload-file').click();
  }

  addAttachment(fileInput: any): void {
    const gameState = fileInput.target.files[0];

    if (gameState != null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(reader.result.toString());
        if (json.hasOwnProperty('player') && json.hasOwnProperty('ai') && json.hasOwnProperty('board')) {
          this.gameState = json;
          this.renderGameState();
        }
      };

      reader.readAsText(gameState);
    }
  }

  renderGameState(): void {
    for (let i = 0; i < this.gameState.board.length; i++) {
      const square = this.gameState.board[i];
      if (square.stone != null) {
        if (square.stone === "black") {
          if (square.special) {
            document.getElementsByName(i.toString())[0].innerHTML = `<img name="blackStoneImg_${i}" class="stones" src="../assets/img/black_special.svg">`;
            document.getElementsByName("blackStoneImg_" + i)[0].addEventListener("click", (e) => {
              this.moveStone(i);
            });
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img name="blackStoneImg_${i}" class="stones" src="../assets/img/black_normal.svg">`;
            document.getElementsByName("blackStoneImg_" + i)[0].addEventListener("click", (e) => {
              this.moveStone(i);
            });
          }
        }
        if (square.stone === "white") {
          if (square.special) {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_special.svg\">`;
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_normal.svg\">`;
          }
        }

      }
      else {
        if (square.special) {
          document.getElementsByName(i.toString())[0].innerHTML = `<img class="images" src="../assets/img/special-field.svg">`;
        }
        else if (square.isFinish) {
          document.getElementsByName(i.toString())[0].innerHTML = ``;
        }
        else {
          document.getElementsByName(i.toString())[0].innerHTML = `<img class="images" src="../assets/img/field.svg">`;
        }
      }
    }
  }

  goToPreviousGameState(): void {
    if (this.gameStateHistory.length >= 2) {
      this.gameState = this.gameStateHistory[this.gameStateHistory.length - 2];
      this.gameStateHistory.splice(-1, 1);
      this.enableDiceRollButton();
      this.renderGameState();
    }
  }
}
