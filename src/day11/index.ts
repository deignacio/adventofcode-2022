import { BADHINTS } from "dns";
import { Day } from "../day";

type Monkey = {
    items: Array<number>
    operation: (old: number) => number
    test: (value: number) => boolean
    divisbleBy: number
    onTrue: number
    onFalse: number
    activityCount: number
}

const buildMonkeys = (input: string): Map<number, Monkey> => {
    const monkeys: Map<number, Monkey> = new Map()
    const lines = input.split(/\r?\n/)
    var i = 0
    while (i < lines.length) {
        var line = lines[i]
        // new monkey
        const monkeyNumber = parseInt(line.split(' ')[1].split(':')[0])
        i++
        // items
        line = lines[i]
        // console.log(i, line, line.split(' ').slice(4).join('').split(','))
        const items = line.split(' ').slice(4).join('').split(',').map(item => parseInt(item))
        // operation
        i++
        line = lines[i]
        const operationBits = line.split(' ').slice(6)
        const operation = operationBits[0]
        // test
        i++
        line = lines[i]
        const divisbleBy: number = parseInt(line.split(' ')[5])
        // onTrue
        i++
        line = lines[i]
        const onTrue: number = parseInt(line.split(' ')[9])
        // onFalse
        i++
        line = lines[i]
        const onFalse: number = parseInt(line.split(' ')[9])
        monkeys.set(monkeyNumber, {
            items: items,
            operation: (old: number) => {
                if (operation == '*') {
                    if (operationBits[1] == 'old') {
                        return old * old
                    } else {
                        return old * parseInt(operationBits[1])
                    }
                }
                if (operation == '+') {
                    if (operationBits[1] == 'old') {
                        return old + old
                    } else {
                        return old + parseInt(operationBits[1])
                    }
                }
                else {
                    return old
                }
            },
            divisbleBy: divisbleBy,
            test: (value: number) => {
                return value % divisbleBy == 0
            },
            onTrue: onTrue,
            onFalse: onFalse,
            activityCount: 0
        })
        i += 2
    }
    return monkeys
}

class Day11 extends Day {

    constructor(){
        super(11);
    }

    solveForPartOne(input: string): string {
        const monkeys = buildMonkeys(input)
        var round = 0
        while (round < 20) {
            // console.log(monkeys)
            for (var i = 0; i < monkeys.size; i++) {
                const monkey = monkeys.get(i)!
                while (monkey.items.length > 0) {
                    monkey.activityCount++
                    const item = monkey.items.splice(0, 1)[0]
                    const next = Math.floor(monkey.operation(item) / 3)
                    const target = monkey.test(next) ? monkey.onTrue : monkey.onFalse
                    // console.log("monkey " + i + " throws to monkey " + target + " value " + next,  monkeys.get(target)!.items)
                    monkeys.get(target)!.items.push(next)
                }
            }
            round++
        }
        // console.log(monkeys)
        const busiest = [...monkeys.values()].sort((a, b) => {
            if (a.activityCount < b.activityCount) {
                return 1
            } else if (a.activityCount > b.activityCount) {
                return -1
            } else {
                return 0
            }
        })
        // console.log(busiest)
        return busiest[0].activityCount * busiest[1].activityCount + ""
    }

    solveForPartTwo(input: string): string {
        const monkeys = buildMonkeys(input)
        // I admit that I was super stuck and this worryCap was found in the work slack channel.
        var worryCap = 1
        const vals = [...monkeys.values()]
        vals.forEach(monkey => {
            worryCap *= monkey.divisbleBy
        })
        // console.log(monkeys, worryCap)
        var round = 0
        const toInspect: Array<number> = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
        while (round < 10000) {
            // console.log(monkeys)
            for (var i = 0; i < monkeys.size; i++) {
                const monkey = monkeys.get(i)!
                while (monkey.items.length > 0) {
                    monkey.activityCount++
                    const item = monkey.items.splice(0, 1)[0]
                    const next = monkey.operation(item) % worryCap
                    const target = monkey.test(next) ? monkey.onTrue : monkey.onFalse
                    monkeys.get(target)!.items.push(next)
                    // console.log("monkey " + i + " throws to monkey " + target + " from " + item + " => " + next,  monkeys.get(target)!.items)
                }
            }
            round++
            if (toInspect.includes(round)) {
                console.log(round)
                monkeys.forEach((monkey, key) => console.log('\t', key, '=>', monkey.activityCount))
            }
        }
        // console.log(monkeys)
        const busiest = [...monkeys.values()].sort((a, b) => {
            if (a.activityCount < b.activityCount) {
                return 1
            } else if (a.activityCount > b.activityCount) {
                return -1
            } else {
                return 0
            }
        })
        // console.log(busiest)
        return busiest[0].activityCount * busiest[1].activityCount + ""
    }
}

export default new Day11;