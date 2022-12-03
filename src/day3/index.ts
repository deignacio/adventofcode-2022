import { Day } from "../day";

const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const priority = (item: string): number => {
    return priorities.indexOf(item) + 1
}

const inCommon = (pack: string, border: number): string => {
    var common:string = ""
    const first = pack.substring(0, border)
    const second = pack.substring(border).split('')
    second.forEach(letter => {
        // console.log(letter)
        if (first.includes(letter)) {
            common = letter
        }
    })
    // console.log(common, first, second)
    return common
}

const inCommonTrio = (first: string, second: string, third: string): string => {
    const common:Array<string> = []
    second.split('').forEach(letter => {
        // console.log(letter, first)
        if (first.includes(letter)) {
            if (third.includes(letter)) {
                if (common.length == 0) {
                    common.push(letter)
                    // console.log("found!", common)    
                }
            }
        }
    })
    // console.log(common)
    return common.join('')
}

class Day3 extends Day {

    constructor(){
        super(3);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        // console.log(lines)
        const outcomes = lines.map(line => {
            const common = inCommon(line, line.length / 2)
            if (common.length == 1) {
                return common
            }
            return ""
        })
        // console.log(outcomes)
        var score = 0
        outcomes.forEach(common => score += priority(common))
        return score +"";
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        // console.log(lines)
        const groups:Array<Array<string>> = []
        var grpIndex = 0
        var group:Array<string> = []
        lines.forEach(line => {
            group.push(line)
            if (grpIndex == 2) {
                grpIndex = 0
                // console.log(group.length)
                groups.push(group)
                group = []
            } else {
                grpIndex++
            }
        })
        // groups.push(group)
        // console.log(groups.length)
        const outcomes = groups.map(grp => {
            const common = inCommonTrio(grp[0], grp[1], grp[2])
            if (common.length == 1) {
                return common
            }
            return ""
        })
        // console.log(outcomes)
        var score = 0
        outcomes.forEach(common => score += priority(common))
        return score +"";
    }
}

export default new Day3;