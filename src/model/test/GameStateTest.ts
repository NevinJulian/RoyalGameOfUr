import { expect } from 'chai';
import { generateBoard, nthSquare } from '../src/Game';
import { Square} from "../src/GameState";

describe('My game state library', () => {
    let board: Square[];

    beforeEach(function() {
        board = generateBoard();
    });

    it('board is generated correctly', () => {
        expect(board.length).is.equal(22);
        console.log(board);
        expect(board[7]).is.deep.equal({stone: null, squareType: "white", special: true});
        

        expect(board.filter(square => square.squareType == "white").length).is.equal(board.filter(square => square.squareType == "black").length);
        expect(board.filter(square => square.special == true).length).is.equal(5);
        expect(board.filter(square => square.squareType == "finish").length).is.equal(2);
    });

    it('is able to get a square of a player', () => {
        expect(nthSquare(board, "black", 5)).is.deep.equal({stone: null, squareType: "neutral", special: false})
        expect(nthSquare(board, "black", 14)).is.deep.equal({stone: null, squareType: "black", special: true})
        expect(nthSquare(board, "black", 15)).is.deep.equal({stone: null, squareType: "finish", special: false})
        expect(nthSquare(board, "white", 4)).is.deep.equal({stone: null, squareType: "white", special: true})
        expect(nthSquare(board, "white", 8)).is.deep.equal({stone: null, squareType: "neutral", special: true})
    });

});