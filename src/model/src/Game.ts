import { Square, SquareType } from './GameState';

export function throwDice(): boolean[] {
    let dice: boolean[] = [false, false, false, false];
    for (let i = 0; i < dice.length; i++) {
        dice[i] = Math.random() <= 0.5;
    }
    return dice
}

export function generateBoard(): Square[] {
    const specialFieldIndexes = [3, 7, 11, 17, 20];
    const finishFieldIndexes = [18, 21];
    const blackFieldIndexes = [0, 1, 2, 3, 16, 17];
    const whiteFieldIndexes = [4, 5, 6, 7, 19, 20];
    return new Array(22).fill(undefined).map((_, i): Square => {
        return {
            stone: null,
            squareType: (() => {
                if (blackFieldIndexes.includes(i)) {
                    return "black";
                }
                if (whiteFieldIndexes.includes(i)) {
                    return "white";
                }
                if (finishFieldIndexes.includes(i)) {
                    return "finish"
                }
                return "neutral";
            })(),
            special: (specialFieldIndexes.includes(i))
        };
    });

}

export function nthSquare(board: Square[], squareType: SquareType, index: number): Square {
    return board.filter(square => square.squareType == squareType || square.squareType == "neutral")[index];
}

