import { Game } from './Game';

export type StoneColor = "black" | "white";
export type SquareType = "black" | "white" | "neutral";

export type Square = {
    stone: StoneColor;
    squareType: SquareType;
    special: boolean; /*Can you move again if you land on the field? true = yes*/
}

export type StoneWarehouse = {
    player: StoneColor;
    stoneCount: number;
}

export type Board = {
    squareArray: Square[];  
}

export type GameState = {
    player1: StoneWarehouse;
    player2: StoneWarehouse;
    board: Board;
}

export const gameState: GameState = {
    player1: null,
    player2: null,
    board: null
}
/*
const foo: Square = {
    stone: "black"
}
*/