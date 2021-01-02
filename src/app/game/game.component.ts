import { Component, OnInit, ViewChild } from '@angular/core';
import { generateStartingGameState, throwDice, moveStone, placeStoneOnBoard, getPossibleMoveSquareIndexes, nthSquare, canPlaceStoneOnBoard } from 'src/model/src/Game';
import { GameState, Player } from 'src/model/src/GameState';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  gameState: GameState;
  diceRoll: number;
  gameStateHistory: GameState[] = [];

  constructor() {
    this.gameState = generateStartingGameState();
  } *

    ngOnInit() {
    let dice = throwDice();
    console.log(dice);
  }

  skipTurn() {
    this.placeAIStone();
    this.disableSkipTurnButton();
    this.enableDiceRollButton();
  }

  canSkipTurn(): boolean {
    if (this.diceRoll == 0) {
      return true;
    } else if (getPossibleMoveSquareIndexes(this.gameState, this.gameState.player, this.diceRoll).length == 0 && canPlaceStoneOnBoard(this.gameState, this.gameState.player, this.diceRoll) == false) {
      console.log("babedi");
      return true;
    }
    return false;
  }

  throwDice() {
    this.diceRoll = throwDice();
    this.disableDiceRollButton();

    if (this.canSkipTurn()) {
      this.enableSkipTurnButton();
    }
  }

  //Add AI turn | move on neutral field
  placeStone(): boolean {
    let isAITurn = true;

    const gameStateAfter = placeStoneOnBoard(this.gameState, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      this.renderGameState();

      if (nthSquare(gameStateAfter.board, gameStateAfter.player.stoneColor, this.diceRoll).special) {
        isAITurn = false;
      }

      if (isAITurn) {
        this.placeAIStone();
      }

      this.enableDiceRollButton();
      this.diceRoll = 0;

      return true;
    }

    return false;
  }

  //Add AI turn | move on neutral field
  moveStone(squareNumber: number): boolean {
    const startSquare = this.convertSquareNumberToNthSquareOfPlayer(squareNumber, this.gameState.player);

    const gameStateAfter = moveStone(this.gameState, startSquare, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;

      this.renderGameState();

      const endSquare = startSquare + this.diceRoll;

      if (!nthSquare(gameStateAfter.board, gameStateAfter.player.stoneColor, endSquare).special) {
        setTimeout(() => {
          this.placeAIStone();
        },
          1000);
      }

      this.enableDiceRollButton();
      this.diceRoll = 0;
      return true;
    }
    return false;
  }

  placeAIStone() {
    this.diceRoll = throwDice();
    const gameStateAfter = placeStoneOnBoard(this.gameState, this.gameState.ai, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
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

  moveAIStone() {
    this.diceRoll = throwDice();
    const possibleMoveSquareIndexes = getPossibleMoveSquareIndexes(this.gameState, this.gameState.ai, this.diceRoll);

    if (possibleMoveSquareIndexes.length != 0) {
      const gameStateAfter = moveStone(this.gameState, possibleMoveSquareIndexes[0], this.gameState.ai, this.diceRoll);
      if (gameStateAfter != null) {
        this.gameStateHistory.push(gameStateAfter);
        this.gameState = gameStateAfter;
        this.renderGameState();

        if (nthSquare(gameStateAfter.board, gameStateAfter.ai.stoneColor, possibleMoveSquareIndexes[0] + this.diceRoll).special) {
          this.placeAIStone();
        }
      }
    }
  }

  convertSquareNumberToNthSquareOfPlayer(squareNumber, playerToMove): number {
    if (playerToMove == this.gameState.player) {
      if (squareNumber <= 3) {
        return squareNumber + 1;
      }
      else if (squareNumber >= 8 && squareNumber <= 18) {
        return squareNumber - 3;
      }
    }
    if (playerToMove == this.gameState.ai) {
      if (squareNumber > 3 && squareNumber <= 15) {
        return squareNumber - 3;
      }
      else if (squareNumber > 18 && squareNumber <= 21) {
        return squareNumber - 6;
      }
    }
  }

  disableDiceRollButton() {
    if (!document.getElementsByClassName("throwDice")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("throwDice")[0].setAttribute("disabled", "disabled");
    }
  }

  enableDiceRollButton() {
    if (document.getElementsByClassName("throwDice")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("throwDice")[0].removeAttribute("disabled");
    }
  }

  enableSkipTurnButton() {
    if (document.getElementsByClassName("skipTurn")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("skipTurn")[0].removeAttribute("disabled");
    }
  }

  disableSkipTurnButton() {
    if (!document.getElementsByClassName("skipTurn")[0].hasAttribute("disabled")) {
      document.getElementsByClassName("skipTurn")[0].setAttribute("disabled", "disabled");
    }
  }

  downloadJSON() {
    const downloadableJSON = JSON.stringify(this.gameState);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", "data:text/json;charset=UTF-8," + encodeURIComponent(downloadableJSON));
    downloadAnchorNode.setAttribute("download", "gamestate.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  renderGameState() {
    for (let i = 0; i < this.gameState.board.length; i++) {
      const square = this.gameState.board[i];
      if (square.stone != null) {
        if (square.stone == "black") {
          if (square.special) {
            document.getElementsByName(i.toString())[0].innerHTML = `<img name="blackStoneImg_${i}" class="stones" src="../assets/img/black_special.svg">`
            document.getElementsByName("blackStoneImg_" + i)[0].addEventListener("click", (e) => {
              this.moveStone(i);
            });
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img name="blackStoneImg_${i}" class="stones" src="../assets/img/black_normal.svg">`
            document.getElementsByName("blackStoneImg_" + i)[0].addEventListener("click", (e) => {
              this.moveStone(i);
            });
          }
        }
        if (square.stone == "white") {
          if (square.special) {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_special.svg\">`
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_normal.svg\">`
          }
        }

      }
      else {
        if (square.special) {
          document.getElementsByName(i.toString())[0].innerHTML = `<img class="images" src="../assets/img/special-field.svg">`
        }
        else if (square.isFinish) {
          document.getElementsByName(i.toString())[0].innerHTML = ``
        }
        else {
          document.getElementsByName(i.toString())[0].innerHTML = `<img class="images" src="../assets/img/field.svg">`
        }
      }
    }
  }
}
