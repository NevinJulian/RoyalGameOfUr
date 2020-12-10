import { expect } from 'chai';
import { throwDice, generateStartingGameState, placeStoneOnBoard, moveStone, nthSquare, validMove } from '../src/Game';
import { Square, GameState } from '../src/GameState';

describe('My game library', () => {
    let gameState: GameState;

    beforeEach(function () {
        gameState = generateStartingGameState();
    });

    it('is able to roll four dice', () => {
        console.log(throwDice());
        expect(throwDice()).is.below(5).and.above(-1);
    });

    it('is able to place stone on board', () => {
        expect(placeStoneOnBoard(gameState.board, gameState.player1, 1)).is.true;
        expect(placeStoneOnBoard(gameState.board, gameState.player2, 3)).is.true;
        console.log(gameState);
    });

    it('cannot play stone if all player stones have been played', () => {
        gameState.player1.notYetPlayedStones = 0;
        expect(placeStoneOnBoard(gameState.board, gameState.player1, 1)).is.false;
    });

    it('cannot play stone if there is already a stone on square', () => {
        expect(placeStoneOnBoard(gameState.board, gameState.player2, 1)).is.true;
        expect(placeStoneOnBoard(gameState.board, gameState.player2, 1)).is.false;
    });

    it('is able to move a stone on the board', () => {
        placeStoneOnBoard(gameState.board, gameState.player2, 1);

        const gameStateAfter = moveStone(gameState, 1, gameState.player2.stoneColor, 2);
        console.log(gameState);
        console.log(gameStateAfter);

        const gameStateToCompare = generateStartingGameState();
        placeStoneOnBoard(gameStateToCompare.board, gameStateToCompare.player2, 3);
        nthSquare(gameStateToCompare.board, gameStateToCompare.player2.stoneColor, 3).stone = gameStateToCompare.player2.stoneColor;

        expect(gameStateAfter).to.deep.equal(gameStateToCompare);
    });

    it('is able to capture a stone of the other player', () => {
        placeStoneOnBoard(gameState.board, gameState.player1, 5);
        placeStoneOnBoard(gameState.board, gameState.player2, 6);

        const gameStateAfter = moveStone(gameState, 5, gameState.player1.stoneColor, 1);
        console.log(gameState);
        console.log(gameStateAfter);

        const gameStateToCompare = generateStartingGameState();
        placeStoneOnBoard(gameStateToCompare.board, gameStateToCompare.player1, 6);
        expect(gameStateAfter).to.deep.equal(gameStateToCompare);
    });

    it('cannot move if startSquare has no stone', () => {
        expect(validMove(gameState, 6, gameState.player1.stoneColor, 4)).is.false;
    });

    it('cannot move if startSquare has same colored stone as endsquare', () => {
        placeStoneOnBoard(gameState.board, gameState.player1, 1);
        placeStoneOnBoard(gameState.board, gameState.player1, 2);

        expect(validMove(gameState, 1, gameState.player1.stoneColor, 1)).is.false;
    });

    it('cannot move if endSquare is a special square', () => {
        placeStoneOnBoard(gameState.board, gameState.player1, 4);
        placeStoneOnBoard(gameState.board, gameState.player1, 1);

        expect(validMove(gameState, 1, gameState.player1.stoneColor, 3)).is.false;
    });
});
