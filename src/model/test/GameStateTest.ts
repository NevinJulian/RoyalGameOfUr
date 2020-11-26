import { expect } from 'chai';
import { generateBoard } from '../src/Game';
import { Square} from "../src/GameState";

describe('My game state library', () => {
    let board: Square[];

    beforeEach(function() {
        board = generateBoard();
    });

    it('board is generated correctly', () => {
        expect(board.length).is.equal(22);
        console.log(board);
        expect(nth_square(board, "black", 3)).is.deep.equal({stone: null, squareType: "black", special: true});
        expect(board[7]).is.deep.equal({stone: null, squareType: "white", special: true});
        

        expect(board.filter(square => square.squareType == "white").length).is.equal(board.filter(square => square.squareType == "black").length);
        expect(board.filter(square => square.special == true).length).is.equal(5);
        expect(board.filter(square => square.squareType == "finish").length).is.equal(2);


    });

});