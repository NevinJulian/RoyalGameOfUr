import { Square, SquareType, Player, GameState, Color } from './GameState';
import { cloneDeep } from 'lodash';

/** Return integer from 0 to 4 */
export function throwDice(): number {
    let dice: boolean[] = [false, false, false, false];
    for (let i = 0; i < dice.length; i++) {
        dice[i] = Math.random() <= 0.5;
    }
    return dice.filter(die => die === true).length;
}

export function generateStartBoard(): Square[] {
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

export function generateStartingGameState(): GameState {
    const STARTING_STONE_COUNT = 7;
    return {
        player1: { stoneColor: "black", notYetPlayedStones: STARTING_STONE_COUNT, finishedStones: 0 },
        player2: { stoneColor: "white", notYetPlayedStones: STARTING_STONE_COUNT, finishedStones: 0 },
        board: generateStartBoard()
    };
}

export function nthSquare(board: Square[], color: Color, n: number): Square | null {
    return board.filter(square => [color, "neutral", "finish"].includes(square.squareType))[n - 1];
}

//remove player param and replace with gameState TODO
export function placeStoneOnBoard(board: Square[], player: Player, diceRoll: number): boolean {
    if (nthSquare(board, player.stoneColor, diceRoll).stone == null && player.notYetPlayedStones > 0) {
        nthSquare(board, player.stoneColor, diceRoll).stone = player.stoneColor;
        player.notYetPlayedStones--;
        return true;
    } else {
        return false;
    }
}

export function moveStone(gameStateBefore: GameState, squareNumber: number, playerColor: Color, diceRoll: number): GameState | null {
    const gameStateAfter = cloneDeep(gameStateBefore);
    const startSquare = this.nthSquare(gameStateAfter.board, playerColor, squareNumber);
    console.log(nthSquare);
    if (validMove(gameStateAfter, squareNumber, playerColor, diceRoll)) {
        console.log("hi");
        startSquare.stone = null;
        const endSquare = this.nthSquare(gameStateAfter.board, playerColor, squareNumber + diceRoll);
        if (endSquare.stone) {
            // player with stone that gets captured, needs to take it back
            if (gameStateAfter.player1.stoneColor == endSquare.stone) {
                gameStateAfter.player1.notYetPlayedStones++;
            } else {
                gameStateAfter.player2.notYetPlayedStones++;
            }
        }
        endSquare.stone = playerColor;
        return gameStateAfter;
    }
}

export function validMove(gameState: GameState, squareNumber: number, playerColor: Color, diceRoll: number): boolean {
    const startSquare = nthSquare(gameState.board, playerColor, squareNumber);
    const endSquare = nthSquare(gameState.board, playerColor, squareNumber + diceRoll);

    if (endSquare == null) {
        return false;
    }
    if (startSquare.stone == null) {
        return false;
    }
    if (endSquare.stone == startSquare.stone) {
        return false;
    }
    if (endSquare.special) {
        return false;
    }



    return true;
}

