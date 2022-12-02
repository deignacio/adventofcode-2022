import { Day } from "../day";

const key: Record<string, string> = {
    X: 'A',
    Y: 'B',
    Z: 'C',
}

const objScores: Record<string, number> = {
    A: 1,
    B: 2,
    C: 3
}

const decrypt = (value: string): string => {
    return key[value]!
}

// X = Lose, Y = Draw, Z = Win
const part2Decrypt = (yours: string, instruction: string):string => {
    if (yours == 'A') {
        if (instruction == 'X') {
            return 'C'
        }
        if (instruction == 'Y') {
            return 'A'
        }
        if (instruction == 'Z') {
            return 'B'
        }
    }
    if (yours == 'B') {
        if (instruction == 'X') {
            return 'A'
        }
        if (instruction == 'Y') {
            return 'B'
        }
        if (instruction == 'Z') {
            return 'C'
        }
    }
    if (yours == 'C') {
        if (instruction == 'X') {
            return 'B'
        }
        if (instruction == 'Y') {
            return 'C'
        }
        if (instruction == 'Z') {
            return 'A'
        }
    }
    return 'X'
}

// returns 1 if I win, 0 if you win
const wins = (yours: string, mine: string): number => {
    if ((yours == 'A' && mine == 'B') ||
        (yours == 'B' && mine == 'C') ||
        (yours == 'C' && mine == 'A')) {
        return 6
    }
    if (yours == mine) {
        return 3
    }
    return 0
}

class Day2 extends Day {

    constructor(){
        super(2);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        // console.log(lines)
        const outcomes = lines.map(line => {
            const choices = line.split(' ')
            const yours = choices[0]
            const mine = decrypt(choices[1])
            const score = wins(yours, mine) + objScores[mine]!
            // console.log(choices, yours, mine, score)
            return score     
        })
        // console.log(outcomes)
        var score = 0
        outcomes.forEach(outcome => score += outcome)
        return score +"";
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        // console.log(lines)
        const outcomes = lines.map(line => {
            const choices = line.split(' ')
            const yours = choices[0]
            const mine = part2Decrypt(choices[0], choices[1])
            const score = wins(yours, mine) + objScores[mine]!
            // console.log(choices, yours, mine, score)
            return score    
        })
        // console.log(outcomes)
        var score = 0
        outcomes.forEach(outcome => score += outcome)
        return score +"";
    }
}

export default new Day2;