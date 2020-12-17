import { Component, OnInit } from '@angular/core';
import { generateStartingGameState, throwDice } from 'src/model/src/Game';
import { GameState } from 'src/model/src/GameState';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  private gameState: GameState;

  constructor() {
    this.gameState = generateStartingGameState();
   }

  ngOnInit(): void {
    let dice = throwDice();
    console.log(dice);
  }

}
