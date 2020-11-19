export class Game {

    public constructor() {
    }

    throwDice(): boolean[] {
        let dice: boolean[] = [false, false, false, false];
        for(let i = 0; i < dice.length; i++){
            dice[i] = Math.random() <= 0.5;
        }
        return dice
    }
}