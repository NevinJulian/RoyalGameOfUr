import { Component, OnInit } from '@angular/core';
import { Game } from 'src/model/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private game: Game;

  constructor() {
    this.game = new Game();
   }

  ngOnInit(): void {
    let dice = this.game.throwDice();
    console.log(dice);
  }

}
