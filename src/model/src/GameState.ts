import { generateBoard } from './Game';

export type StoneColor = "black" | "white";
export type SquareType = "black" | "white" | "neutral" | "finish";
const STARTING_STONE_COUNT = 7;

export type Square = {
    stone: StoneColor|null;
    squareType: SquareType;
    special: boolean; /*Can you move again if you land on the field? true = yes*/
}

export type Player = {
    player: StoneColor;
    notYetPlayedStones: number;
    finishedStones: number;
}

export type GameState = {
    player1: Player;
    player2: Player;
    board: Square[];
}

export const gameState: GameState = {
    player1: { player: "black", notYetPlayedStones: STARTING_STONE_COUNT, finishedStones: 0 },
    player2: { player: "white", notYetPlayedStones: STARTING_STONE_COUNT, finishedStones: 0 },
    board: generateBoard()
}


/*
const foo: Square = {
    stone: "black"
}
*/