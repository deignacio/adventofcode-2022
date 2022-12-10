import internal from "stream";
import { Day } from "../day";

type Circuit = {
    cycle: number
    value: number
}

class Day10 extends Day {

    constructor(){
        super(10);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        const circuit: Circuit = { cycle: 0, value: 1 }
        const signalStrength: Map<number, number> = new Map()
        lines.forEach(line => {
            const bits = line.split(' ')
            if (bits[0] == 'noop') {
                circuit.cycle++
                if (circuit.cycle % 20 == 0) {
                    signalStrength.set(circuit.cycle, circuit.value * circuit.cycle)
                }
            }
            if (bits[0] == 'addx') {
                circuit.cycle += 2
                if (circuit.cycle % 20 == 0) {
                    signalStrength.set(circuit.cycle, circuit.value * circuit.cycle)
                }
                if (circuit.cycle % 20 == 1) {
                    signalStrength.set(circuit.cycle - 1, circuit.value * (circuit.cycle-1))
                }
                circuit.value += parseInt(bits[1])
            }
        })
        var sum = 0
        const desired: Array<number> = [20, 60, 100, 140, 180, 220]
        desired.forEach(value => sum += signalStrength.get(value)!)
        return "" + sum;
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        const circuit: Circuit = { cycle: 0, value: 1 }
        const output: Array<string> = []
        lines.forEach(line => {
            const bits = line.split(' ')
            // console.log(circuit, line)
            if (bits[0] == 'noop') {
                if (Math.abs((circuit.cycle%40) - circuit.value) <= 1) {
                    // console.log(circuit.cycle, '#')
                    output.push('#')
                } else {
                    // console.log(circuit.cycle, '.')
                    output.push('.')
                }
                // note the increment after the calculation, ...
                circuit.cycle++
            }
            if (bits[0] == 'addx') {
                if (Math.abs((circuit.cycle%40) - circuit.value) <= 1) {
                    // console.log(circuit.cycle, '#')
                    output.push('#')
                } else {
                    // console.log(circuit.cycle, '.')
                    output.push('.')
                }
                circuit.cycle++
                if (Math.abs((circuit.cycle%40) - circuit.value) <= 1) {
                    // console.log(circuit.cycle, '#')
                    output.push('#')
                } else {
                    // console.log(circuit.cycle, '.')
                    output.push('.')
                }
                circuit.cycle++
                circuit.value += parseInt(bits[1])
            }
        })
        for (var i = 0; i < output.length; i+= 40) {
            console.log(output.slice(i, i+39).join(''))
        }
        return "";
    }
}

export default new Day10;