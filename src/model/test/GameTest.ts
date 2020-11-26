import { expect } from 'chai';
import { nthSquare, throwDice } from '../src/Game';
import { generateBoard as getStartBoard } from '../src/Game';
import { Square } from '../src/GameState';

describe('My game library', () => {
    const board = getStartBoard();
    
    it('is able to roll four dice', () => {
        expect(throwDice().length).to.equal(4);
    });

    it('is able to get any field of a play color', () => {
        expect(nthSquare(board, "black", 5)).is.deep.equal({stone: null, squareType: "neutral", special: false})
    });

});