import { Component, OnInit, ViewChild } from '@angular/core';
import { generateStartingGameState, throwDice, moveStone, placeStoneOnBoard } from 'src/model/src/Game';
import { GameState } from 'src/model/src/GameState';


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

  throwDice() {
    this.diceRoll = throwDice();
    this.disableDiceRollButton();
  }

  //Add AI turn | move on neutral field
  placeStone(): boolean {
    const gameStateAfter = placeStoneOnBoard(this.gameState, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      this.renderGameState();
      this.enableDiceRollButton();
      this.diceRoll = 0;
      return true;
    }
    return false;
  }

  //Add AI turn | move on neutral field
  moveStone(squareNumber: number): boolean {
    console.log("yeet");
    const gameStateAfter = moveStone(this.gameState, squareNumber, this.gameState.player, this.diceRoll);
    if (gameStateAfter != null) {
      this.gameStateHistory.push(gameStateAfter);
      this.gameState = gameStateAfter;
      this.renderGameState();
      this.enableDiceRollButton();
      this.diceRoll = 0;
      return true;
    }
    return false;
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
              this.moveStone(i + 1);
            });
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img name="blackStoneImg_${i}" class="stones" src="../assets/img/black_normal.svg">`
            document.getElementsByName("blackStoneImg_" + i)[0].addEventListener("click", (e) => {
              this.moveStone(i + 1);
            });
          }
        }
        if (square.stone == "white") {
          if (square.special) {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_special.svg\" (click)=\"moveStone(${i + 1}})\">`
          }
          else {
            document.getElementsByName(i.toString())[0].innerHTML = `<img class=\"stones\" src=\"../assets/img/white_normal.svg\" (click)=\"moveStone(${i + 1})\">`
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
