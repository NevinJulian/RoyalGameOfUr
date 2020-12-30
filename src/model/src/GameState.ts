export type Color = "black" | "white";
export type SquareType = "black" | "white" | "neutral";

export type Square = {
    stone: Color | null;
    squareType: SquareType;
    special: boolean; /*Can you move again if you land on the field? true = yes*/
    isFinish: boolean;
}

export type Player = {
    stoneColor: Color;
    notYetPlayedStones: number;
    finishedStones: number;
}

export type GameState = {
    player: Player;
    ai: Player;
    board: Square[];
}