import { expect } from 'chai';
import { throwDice, generateStartingGameState, placeStoneOnBoard, moveStone, nthSquare, validMove, hasPlayerWon } from '../src/Game';
import { Square, GameState } from '../src/GameState';

describe('My game library', () => {
    let gameState: GameState;

    beforeEach(function () {
        gameState = generateStartingGameState();
    });

    it('is able to roll four dice', () => {
        expect(throwDice()).is.below(5).and.above(-1);
    });

    it('is able to place stone on board', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.player1, 1);
        expect(gameState).deep.equal(gameStateAfter);
    });

    it('cannot play stone if all player stones have been played', () => {
        gameState.player1.notYetPlayedStones = 0;
        expect(placeStoneOnBoard(gameState, gameState.player1, 1)).is.false;
    });

    it('cannot play stone if there is already a stone on square', () => {
        expect(placeStoneOnBoard(gameState, gameState.player2, 1)).is.true;
        expect(placeStoneOnBoard(gameState, gameState.player2, 1)).is.false;
    });

    it('is able to move a stone on the board', () => {
        placeStoneOnBoard(gameState, gameState.player2, 1);

        const gameStateAfter = moveStone(gameState, 1, gameState.player2, 2);

        const gameStateToCompare = generateStartingGameState();
        placeStoneOnBoard(gameStateToCompare, gameStateToCompare.player2, 3);
        nthSquare(gameStateToCompare.board, gameStateToCompare.player2.stoneColor, 3).stone = gameStateToCompare.player2.stoneColor;

        expect(gameStateAfter).to.deep.equal(gameStateToCompare);
    });

    it('is able to capture a stone of the other player', () => {
        placeStoneOnBoard(gameState, gameState.player1, 5);
        placeStoneOnBoard(gameState, gameState.player2, 6);

        const gameStateAfter = moveStone(gameState, 5, gameState.player1, 1);

        const gameStateToCompare = generateStartingGameState();
        placeStoneOnBoard(gameStateToCompare, gameStateToCompare.player1, 6);
        expect(gameStateAfter).to.deep.equal(gameStateToCompare);
    });

    it('cannot move if startSquare has no stone', () => {
        expect(validMove(gameState, 6, gameState.player1.stoneColor, 4)).is.false;
    });

    it('cannot move if startSquare has same colored stone as endsquare', () => {
        placeStoneOnBoard(gameState, gameState.player1, 1);
        placeStoneOnBoard(gameState, gameState.player1, 2);

        expect(validMove(gameState, 1, gameState.player1.stoneColor, 1)).is.false;
    });

    it('cannot move if endSquare is a special square', () => {
        placeStoneOnBoard(gameState, gameState.player1, 4);
        placeStoneOnBoard(gameState, gameState.player1, 1);

        expect(validMove(gameState, 1, gameState.player1.stoneColor, 3)).is.false;
    });

    it('cannot move if endSquare is not a square on the board', () => {
        placeStoneOnBoard(gameState, gameState.player2, 13);

        expect(validMove(gameState, 1, gameState.player2.stoneColor, 4)).is.false;
    });

    it('stone on finish square gets finished', () => {
        placeStoneOnBoard(gameState, gameState.player2, 13);

        expect(validMove(gameState, 13, gameState.player2.stoneColor, 2)).is.true;
        expect(nthSquare(gameState.board, gameState.player2.stoneColor, 15).stone).is.null;

        const gameStateAfter = moveStone(gameState, 13, gameState.player2, 2);
        console.log(gameStateAfter);
        expect(gameStateAfter.player2.finishedStones).to.equal(1);
    });

    it('returns null if move was invalid', () => {
        expect(validMove(gameState, 2, gameState.player2.stoneColor, 2)).is.false;
        expect(nthSquare(gameState.board, gameState.player2.stoneColor, 15).stone).is.null;

        const gameStateAfter = moveStone(gameState, 13, gameState.player2, 2);
        expect(gameStateAfter).to.be.null;
    });

    it('does player win with 7 finished stones', () => {
        gameState.player1.finishedStones = 7;

        expect(hasPlayerWon(gameState.player1)).is.true;
    });
});
