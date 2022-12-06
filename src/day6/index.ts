import { Day } from "../day";


const allUnique = (input: Array<string>, start: number, end: number): boolean => {
    const chars = input.slice(start, end)
    // console.log(chars)
    while (chars.length > 1) {
        const char = chars.pop()!
        if (chars.includes(char)) {
            return false
        }
    }
    return true
}

class Day6 extends Day {

    constructor(){
        super(6);
    }

    solveForPartOne(input: string): string {
        const bits = input.split('')
        var start = 0
        while (start + 4 < bits.length) {
            if (allUnique(bits, start, start + 4)) {
                return start + 4 + ""
            }
            start++
        }
        return ""
    }

    solveForPartTwo(input: string): string {
        const bits = input.split('')
        var start = 0
        while (start + 4 < bits.length) {
            if (allUnique(bits, start, start + 14)) {
                return start + 14 + ""
            }
            start++
        }
        return ""   
    }
}

export default new Day6;