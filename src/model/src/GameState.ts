import { generateStartingGameState } from './Game';

export type Color = "black" | "white";
export type SquareType = "black" | "white" | "neutral" | "finish";

export type Square = {
    stone: Color | null;
    squareType: SquareType;
    special: boolean; /*Can you move again if you land on the field? true = yes*/
}

export type Player = {
    stoneColor: Color;
    notYetPlayedStones: number;
    finishedStones: number;
}

export type GameState = {
    player1: Player;
    player2: Player;
    board: Square[];
}