import { expect } from 'chai';
import { throwDice, generateStartingGameState, placeStoneOnBoard, moveStone, nthSquare, validMove, hasPlayerWon, canRepeatMove, getPossibleMoveSquareIndexes, canPlaceStoneOnBoard } from '../src/Game';
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
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.player, 1);
        expect(nthSquare(gameStateAfter.board, gameStateAfter.player.stoneColor, 1).stone).equals("black");
    });

    it('cannot play stone if all player stones have been played', () => {
        gameState.player.notYetPlayedStones = 0;
        expect(placeStoneOnBoard(gameState, gameState.player, 1)).is.null;
    });

    it('cannot play stone if there is already a stone of same color on square', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.player, 1);
        expect(placeStoneOnBoard(gameStateAfter, gameState.player, 1)).is.null;
    });

    it('is able to move a stone on the board', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.ai, 1);

        const gameStateAfterMoving = moveStone(gameStateAfterPlacing, 1, gameState.ai, 2);

        const gameStateToCompare = generateStartingGameState();
        const gameStateToCompareAfterPlacing = placeStoneOnBoard(gameStateToCompare, gameStateToCompare.ai, 3);
        nthSquare(gameStateToCompareAfterPlacing.board, gameStateToCompareAfterPlacing.ai.stoneColor, 3).stone = gameStateToCompareAfterPlacing.ai.stoneColor;

        expect(gameStateAfterMoving).to.deep.equal(gameStateToCompareAfterPlacing);
    });

    it('is able to capture a stone of the other player', () => {

        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player, 5);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.ai, 6);

        const gameStateAfter = moveStone(gameStateAfterPlacingTwice, 5, gameStateAfterPlacingTwice.player, 1);

        const gameStateToCompare = generateStartingGameState();
        const gameStateToCompareAfter = placeStoneOnBoard(gameStateToCompare, gameStateToCompare.player, 6);
        expect(gameStateAfter).to.deep.equal(gameStateToCompareAfter);
    });

    it('cannot move if startSquare has no stone', () => {
        expect(validMove(gameState, 6, gameState.player.stoneColor, 4)).is.false;
    });

    it('cannot capture if startSquare has same colored stone as endsquare', () => {
        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player, 1);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.player, 2);

        expect(validMove(gameStateAfterPlacingTwice, 1, gameStateAfterPlacingTwice.player.stoneColor, 1)).is.false;
    });

    it('cannot capture if endSquare is a special square', () => {
        const gameStateAfterPlacingOnce = placeStoneOnBoard(gameState, gameState.player, 4);
        const gameStateAfterPlacingTwice = placeStoneOnBoard(gameStateAfterPlacingOnce, gameStateAfterPlacingOnce.player, 1);

        expect(validMove(gameState, 1, gameState.player.stoneColor, 3)).is.false;
    });

    it('cannot move if endSquare is not a square on the board', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.ai, 13);

        expect(validMove(gameStateAfterPlacing, 1, gameStateAfterPlacing.ai.stoneColor, 4)).is.false;
    });

    it('stone on finish square gets finished', () => {
        const gameStateAfterPlacing = placeStoneOnBoard(gameState, gameState.ai, 13);

        expect(validMove(gameStateAfterPlacing, 13, gameStateAfterPlacing.ai.stoneColor, 2)).is.true;
        expect(nthSquare(gameStateAfterPlacing.board, gameStateAfterPlacing.ai.stoneColor, 15).stone).is.null;

        const gameStateAfter = moveStone(gameStateAfterPlacing, 13, gameStateAfterPlacing.ai, 2);
        console.log(gameStateAfter);
        expect(gameStateAfter.ai.finishedStones).to.equal(1);
    });

    it('returns null if move was invalid', () => {
        expect(validMove(gameState, 2, gameState.ai.stoneColor, 2)).is.false;
        expect(nthSquare(gameState.board, gameState.ai.stoneColor, 15).stone).is.null;

        const gameStateAfter = moveStone(gameState, 13, gameState.ai, 2);
        expect(gameStateAfter).to.be.null;
    });

    it('does player win with 7 finished stones', () => {
        gameState.player.finishedStones = 7;

        expect(hasPlayerWon(gameState.player)).is.true;
    });

    it('can player repeat move on special square', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.ai, 4);
        expect(canRepeatMove(gameStateAfter, gameStateAfter.ai, 4)).is.true;
    });

    it('can get all possible move square indexes of player', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.ai, 3);
        expect(getPossibleMoveSquareIndexes(gameStateAfter, gameState.ai, 4)).to.be.deep.equal([3]);
    });

    it('can check if player can place stone on board', () => {
        expect(canPlaceStoneOnBoard(gameState, gameState.ai, 4)).to.be.deep.equal(true);
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.ai, 4);
        expect(canPlaceStoneOnBoard(gameStateAfter, gameState.ai, 4)).to.be.false
    });

    it('cannot capture enemy stone on special field', () => {
        const gameStateAfter = placeStoneOnBoard(gameState, gameState.ai, 8);
        const gameStateAfterPlacing = placeStoneOnBoard(gameStateAfter, gameState.player, 6);
        expect(validMove(gameStateAfterPlacing, 6, gameStateAfterPlacing.player.stoneColor, 2)).false;
    });
});
