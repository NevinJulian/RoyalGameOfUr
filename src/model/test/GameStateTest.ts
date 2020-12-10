import { expect } from 'chai';
import { nthSquare, generateStartBoard } from '../src/Game';
import { Square } from "../src/GameState";

describe('My game state library', () => {
    let board: Square[];

    beforeEach(function () {
        board = generateStartBoard();
    });

    it('board is generated correctly', () => {
        expect(board.length).is.equal(22);
        console.log(board);
        expect(board[7]).is.deep.equal({ stone: null, squareType: "white", special: true, isFinish: false });


        expect(board.filter(square => square.squareType == "white").length).is.equal(board.filter(square => square.squareType == "black").length);
        expect(board.filter(square => square.special).length).is.equal(5);
        expect(board.filter(square => square.isFinish).length).is.equal(2);
    });

    it('is able to get a square of a player', () => {
        expect(nthSquare(board, "black", 5)).is.deep.equal({ stone: null, squareType: "neutral", special: false, isFinish: false })
        expect(nthSquare(board, "black", 14)).is.deep.equal({ stone: null, squareType: "black", special: true, isFinish: false })
        expect(nthSquare(board, "black", 15)).is.deep.equal({ stone: null, squareType: "black", special: false, isFinish: true })
        expect(nthSquare(board, "white", 4)).is.deep.equal({ stone: null, squareType: "white", special: true, isFinish: false })
        expect(nthSquare(board, "white", 8)).is.deep.equal({ stone: null, squareType: "neutral", special: true, isFinish: false })
    });

});