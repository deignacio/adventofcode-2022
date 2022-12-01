import { Day } from "../day";

class Day1 extends Day {

    constructor(){
        super(1)
    }

    makeElves(input: string): Map<number, number> {
        const lines = input.split(/\r?\n/)
        const elves: Map<number, number> = new Map()
        var id = 0
        lines.forEach(line => {
            const elfId = id
            if (line.trim().length == 0) {
                id++
                elves.set(elfId + 1, 0)
            } else {
                elves.set(elfId, (elves.get(elfId) || 0) + parseInt(line, 10))
            }
        })
        return elves
    }

    solveForPartOne(input: string): string {
        const elves = this.makeElves(input)
        var maxCalories:number = 0
        elves.forEach(calories => {
            if (calories > maxCalories) {
                maxCalories = calories
            }
        })

        return maxCalories + ""
    }

    solveForPartTwo(input: string): string {
        const elves = this.makeElves(input)
        const values = [...elves.values()]
        // For some reason there's a NaN in there, so this becomes text sort without the comparator
        values.sort((a, b) => {
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        })
        var sum = values.pop()! + values.pop()! + values.pop()!

        return sum + ""
    }
}

export default new Day1;
