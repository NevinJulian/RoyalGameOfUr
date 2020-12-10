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
        expect(nthSquare(gameStateAfter.board, gameStateAfter.player1.stoneColor, 1).stone).equals("black");
    });

    it('cannot play stone if all player stones have been played', () => {
        gameState.player1.notYetPlayedStones = 0;
        expect(placeStoneOnBoard(gameState, gameState.player1, 1)).is.null;
    });

    it('cannot play stone if there is already a stone on square', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.player1, 1);
        expect(placeStoneOnBoard(gameStateAfter, gameState.player1, 1)).is.null;
    });

    it('is able to move a stone on the board', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.player2, 1);

        const gameStateAfterMoving = moveStone(gameStateAfterPlacing, 1, gameState.player2, 2);

        const gameStateToCompare = generateStartingGameState();
        const gameStateToCompareAfterPlacing = placeStoneOnBoard(gameStateToCompare, gameStateToCompare.player2, 3);
        nthSquare(gameStateToCompareAfterPlacing.board, gameStateToCompareAfterPlacing.player2.stoneColor, 3).stone = gameStateToCompareAfterPlacing.player2.stoneColor;

        expect(gameStateAfterMoving).to.deep.equal(gameStateToCompareAfterPlacing);
    });

    it('is able to capture a stone of the other player', () => {

        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player1, 5);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.player2, 6);

        const gameStateAfter = moveStone(gameStateAfterPlacingTwice, 5, gameStateAfterPlacingTwice.player1, 1);

        const gameStateToCompare = generateStartingGameState();
        const gameStateToCompareAfter = placeStoneOnBoard(gameStateToCompare, gameStateToCompare.player1, 6);
        expect(gameStateAfter).to.deep.equal(gameStateToCompareAfter);
    });

    it('cannot move if startSquare has no stone', () => {
        expect(validMove(gameState, 6, gameState.player1.stoneColor, 4)).is.false;
    });

    it('cannot move if startSquare has same colored stone as endsquare', () => {
        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player1, 1);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.player1, 2);

        expect(validMove(gameStateAfterPlacingTwice, 1, gameStateAfterPlacingTwice.player1.stoneColor, 1)).is.false;
    });

    it('cannot move if endSquare is a special square', () => {
        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player1, 4);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.player1, 1);

        expect(validMove(gameState, 1, gameState.player1.stoneColor, 3)).is.false;
    });

    it('cannot move if endSquare is not a square on the board', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.player2, 13);

        expect(validMove(gameStateAfterPlacing, 1, gameStateAfterPlacing.player2.stoneColor, 4)).is.false;
    });

    it('stone on finish square gets finished', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.player2, 13);

        expect(validMove(gameStateAfterPlacing, 13, gameStateAfterPlacing.player2.stoneColor, 2)).is.true;
        expect(nthSquare(gameStateAfterPlacing.board, gameStateAfterPlacing.player2.stoneColor, 15).stone).is.null;

        const gameStateAfter = moveStone(gameStateAfterPlacing, 13, gameStateAfterPlacing.player2, 2);
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
