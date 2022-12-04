import { Day } from "../day";

const contains = (first:Array<number>, second:Array<number>): number => {
    if (first[0] <= second[0]) {
        if (first[1] >= second[1]) {
            return 1
        }
    }
    if (second[0] <= first[0]) {
        if (second[1] >= first[1]) {
            return 1
        }
    }
    return 0
}

const anyOverlap = (first:Array<number>, second:Array<number>): number => {
    if (first[0] <= second[0]) {
        if (first[1] >= second[0]) {
            return 1
        }
    }
    if (second[0] <= first[0]) {
        if (second[1] >= first[0]) {
            return 1
        }
    }
    return 0
}

class Day4 extends Day {

    constructor(){
        super(4);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        const pairs = lines.map(line => line.split(','))
            .map(pair => [
                pair[0].split('-')
                    .map(p => parseInt(p)),
                pair[1].split('-')
                    .map(p => parseInt(p))
            ])
        // console.log(pairs)
        const overlaps = pairs.map(pair => contains(pair[0], pair[1]))
        // console.log(overlaps)
        const sum = overlaps.reduce((acc, curr) => acc + curr, 0)
        return sum + ""
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        const pairs = lines.map(line => line.split(','))
            .map(pair => [
                pair[0].split('-')
                    .map(p => parseInt(p)),
                pair[1].split('-')
                    .map(p => parseInt(p))
            ])
        // console.log(pairs)
        const overlaps = pairs.map(pair => anyOverlap(pair[0], pair[1]))
        // console.log(overlaps)
        const sum = overlaps.reduce((acc, curr) => acc + curr, 0)
        return sum + ""
    }
}

export default new Day4;
