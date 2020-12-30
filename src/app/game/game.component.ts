import { Component, OnInit, ViewChild } from '@angular/core';
import { generateStartingGameState, throwDice } from 'src/model/src/Game';
import { GameState } from 'src/model/src/GameState';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  gameState: GameState;
  diceThrow: number;

  constructor() {
    this.gameState = generateStartingGameState();
  } *

    ngOnInit() {
    let dice = throwDice();
    console.log(dice);
  }

  throwDice() {
    this.diceThrow = throwDice();
  }

  placeStone() {
    document.getElementsByName("1")[0].innerHTML += "<img class=\"stones\" src=\"../assets/img/black-stone.svg\">"
  }

  
downloadJSON(){
  const downloadableJSON = JSON.stringify(this.gameState);
  const uri = "data:text/json;charset=UTF-8," + encodeURIComponent(downloadableJSON);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", uri);
  downloadAnchorNode.setAttribute("download", "gamestate.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

  renderGameState() {
    for (let i = 0; i <= this.gameState.board.length; i++) {
      if (this.gameState.board[i].stone) {
        document.getElementsByName(i.toString())[0].innerHTML = "<img class=\"images\" src=\"../assets/img/black-stone.svg\" style=\"position: absolute;\">"
      }
    }
  }
}
