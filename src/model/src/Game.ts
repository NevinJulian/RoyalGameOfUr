import { Square, SquareType, Player, GameState, Color } from './GameState';
import { cloneDeep } from 'lodash';
import { isEqual } from 'lodash';

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
    const blackFieldIndexes = [0, 1, 2, 3, 16, 17, 18];
    const whiteFieldIndexes = [4, 5, 6, 7, 19, 20, 21];
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
                return "neutral";
            })(),
            special: (specialFieldIndexes.includes(i)),
            isFinish: (finishFieldIndexes.includes(i))
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
    return board.filter(square => [color, "neutral"].includes(square.squareType))[n - 1];
}

//remove player param and replace with gameState TODO
export function placeStoneOnBoard(gameState: GameState, player: Player, diceRoll: number): GameState {
    const gameStateAfter = cloneDeep(gameState);
    if (nthSquare(gameStateAfter.board, player.stoneColor, diceRoll).stone == null && player.notYetPlayedStones > 0) {
        nthSquare(gameStateAfter.board, player.stoneColor, diceRoll).stone = player.stoneColor;
        if (isEqual(gameStateAfter.player1, player)) {
            gameStateAfter.player1.notYetPlayedStones--;
        } else {
            gameStateAfter.player2.notYetPlayedStones--;
        }
    } else {
        return null;
    }
    return gameStateAfter;
}

export function moveStone(gameStateBefore: GameState, squareNumber: number, player: Player, diceRoll: number): GameState | null {
    const gameStateAfter = cloneDeep(gameStateBefore);
    const startSquare = this.nthSquare(gameStateAfter.board, player.stoneColor, squareNumber);
    if (validMove(gameStateAfter, squareNumber, player.stoneColor, diceRoll)) {
        startSquare.stone = null;
        const endSquare = this.nthSquare(gameStateAfter.board, player.stoneColor, squareNumber + diceRoll);
        if (endSquare.stone) {
            // player with stone that gets captured, needs to take it back
            if (isEqual(gameStateAfter.player1, player)) {
                gameStateAfter.player2.notYetPlayedStones++;
            } else {
                gameStateAfter.player1.notYetPlayedStones++;
            }
        }
        if (endSquare.isFinish) {
            endSquare.stone = null;
            if (isEqual(gameStateAfter.player1, player)) {
                gameStateAfter.player1.finishedStones++;
            } else {
                gameStateAfter.player2.finishedStones++;
            }
        } else {
            endSquare.stone = player.stoneColor;
        }
        return gameStateAfter;
    } else {
        return null;
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
    } else if (endSquare.stone) {
        if (endSquare.special) {
            return false;
        }
    }
    return true;
}

export function canRepeatMove(gameState: GameState, player: Player, squareNumber: number): boolean {
    return nthSquare(gameState.board, player.stoneColor, squareNumber).special;
}

export function hasPlayerWon(player: Player): boolean {
    return player.finishedStones == 7;
}

export function getPossibleMoveSquareIndexes(gameState: GameState, player: Player, diceRoll: number): Square[] {
    let possibleMoveSquares = [];
    for (let i = 1; i <= 14; i++) {
        const square = nthSquare(gameState.board, player.stoneColor, i);
        if (square.stone) {
            if (validMove(gameState, i, player.stoneColor, diceRoll)) {
                possibleMoveSquares.push(i);
            }
        }
    }
    return possibleMoveSquares;
}

export function canPlaceStoneOnBoard(gameState: GameState, player: Player, diceRoll: number): boolean {
    const square = nthSquare(gameState.board, player.stoneColor, diceRoll);
    if (!square.stone) {
        return true;
    } else {
        return false;
    }
}