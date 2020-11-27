import { expect } from 'chai';
import { throwDice } from '../src/Game';
import { generateBoard as getStartBoard } from '../src/Game';

describe('My game library', () => {
    const board = getStartBoard();
    
    it('is able to roll four dice', () => {
        expect(throwDice().length).to.equal(4);
    });

});