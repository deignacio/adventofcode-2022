import { Day } from "../day";

type Move = {
    count: number,
    from: number,
    to: number
}

type ParseInputResponse = {
    instructions: Array<Move>,
    stacks: Array<Array<string>>
}

const parseInput = (lines:Array<string>): ParseInputResponse => {
    var numStacks = -1
    var maxStack = -1
    lines.forEach((line, index) => {
        if (line.startsWith(' 1')) {
            numStacks = parseInt(line[line.length-2], 10)
            maxStack = index
        }
    })
    // console.log(numStacks, maxStack)
    const stackDefLines = lines.slice(0, maxStack)
    // console.log(stackDefLines)
    const stacks: Array<Array<string>> = []
    for (var i = 1; i <= numStacks; i++) {
        const crateIndex = (i-1) * 4 + 1
        // console.log(i, crateIndex)
        const stack: Array<string> = []
        stackDefLines.forEach(line => {
            const crate = line[crateIndex]
            // console.log(crate)
            if (crate != ' ') {
                stack.push(crate)
            }
        })
        // console.log(stack)
        stacks.push(stack)
    }
    // console.log(stacks)
    const instructionLines = lines.slice(maxStack + 2)
    const instructions = instructionLines.map(line => {
        const tokens = line.split(' ')
        return { count: parseInt(tokens[1]), from: parseInt(tokens[3]), to: parseInt(tokens[5])}
    })
    // console.log(instructions)
    return { instructions: instructions, stacks: stacks }
} 

const doMoves = (instructions: Array<Move>, stacks: Array<Array<string>>): Array<Array<string>> => {
    instructions.forEach(instruction => {
        // console.log(instruction)
        const from = stacks[instruction.from - 1]
        const to = stacks[instruction.to - 1]
        const toMove = from.splice(0, instruction.count).reverse()
        to.splice(0, 0, ...toMove)
        // console.log(stacks)
    })
    return stacks
}

const doMovesPart2 = (instructions: Array<Move>, stacks: Array<Array<string>>): Array<Array<string>> => {
    instructions.forEach(instruction => {
        // console.log(instruction)
        const from = stacks[instruction.from - 1]
        const to = stacks[instruction.to - 1]
        const toMove = from.splice(0, instruction.count)
        to.splice(0, 0, ...toMove)
        // console.log(stacks)
    })
    return stacks
}

class Day5 extends Day {

    constructor(){
        super(5);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        const parsed = parseInput(lines)
        const final = doMoves(parsed.instructions, parsed.stacks)
        const answer = final.reduce((acc, curr) => acc + curr[0], "")
        return answer;
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        const parsed = parseInput(lines)
        const final = doMovesPart2(parsed.instructions, parsed.stacks)
        const answer = final.reduce((acc, curr) => acc + curr[0], "")
        return answer;
    }
}

export default new Day5;