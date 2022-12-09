import { serialize } from "v8";
import { Day } from "../day";

type Coord = {
    x: number
    y: number
}

const toS = (coord: Coord): string => {
    return "(" + coord.x + "," + coord.y + ")"
}

type Move = {
    dir: string
    dist: number
}

const readInput = (input: string): Array<Move> => {
    return input.split(/\r?\n/).map(line => {
        const bits = line.split(' ')
        return { dir: bits[0], dist: parseInt(bits[1])}
    })
}

const maybeMoveTails = (head: Coord, tails: Coord): Coord => {
    const next: Coord = {x: tails.x, y: tails.y}
    if (head.x - tails.x == 2) { 
        next.x++
        if (head.y - tails.y == 1) { 
            next.y++
        }
        if (tails.y - head.y == 1) { 
            next.y--
        }
    }
    if (tails.x - head.x == 2) {
        next.x--
        if (head.y - tails.y == 1) { 
            next.y++
        }
        if (tails.y - head.y == 1) { 
            next.y--
        }
    }
    if (head.y - tails.y == 2) { 
        next.y++
        if (head.x - tails.x == 1) { 
            next.x++
        }
        if (tails.x - head.x == 1) {
            next.x--
        }
    }
    if (tails.y - head.y == 2) { 
        next.y--
        if (head.x - tails.x == 1) { 
            next.x++
        }
        if (tails.x - head.x == 1) {
            next.x--
        }
    }
    return next
}

class Day9 extends Day {

    constructor(){
        super(9);
    }

    solveForPartOne(input: string): string {
        const moves = readInput(input)
        // console.log(moves)
        var head: Coord = {x:0, y:0}
        var tails: Coord = {x:0, y:0}
        const trails: Map<string, boolean> = new Map()
        trails.set(toS(tails), true)
        moves.forEach(move => {
            for (var i = 0; i < move.dist; i++) {
                if (move.dir == 'U') { 
                    head = {x: head.x, y: head.y+1}
                }
                if (move.dir == 'D') { 
                    head = {x: head.x, y: head.y-1}
                }
                if (move.dir == 'L') { 
                    head = {x: head.x-1, y: head.y}                    
                }
                if (move.dir == 'R') { 
                    head = {x: head.x+1, y: head.y}
                }
                tails = maybeMoveTails(head, tails)
                trails.set(toS(tails), true)
                // console.log(move, head, tails)
            }
        })
        // console.log(trails)
        return trails.size + "";
    }

    solveForPartTwo(input: string): string {
        const moves = readInput(input)
        // console.log(moves)
        var snake: Array<Coord> = []
        for (var i = 0; i < 10; i++) {
            snake.push({x:0, y:0})
        }
        const trails: Map<string, boolean> = new Map()
        trails.set(toS(snake[0]), true)
        moves.forEach(move => {
            for (var i = 0; i < move.dist; i++) {
                if (move.dir == 'U') { 
                    snake[0] = {x: snake[0].x, y: snake[0].y+1}
                }
                if (move.dir == 'D') { 
                    snake[0] = {x: snake[0].x, y: snake[0].y-1}
                }
                if (move.dir == 'L') { 
                    snake[0] = {x: snake[0].x-1, y: snake[0].y}                    
                }
                if (move.dir == 'R') { 
                    snake[0] = {x: snake[0].x+1, y: snake[0].y}
                }
                for (var j = 1; j < snake.length; j++) {
                    snake[j] = maybeMoveTails(snake[j-1], snake[j])
                }
                trails.set(toS(snake[snake.length-1]), true)
                // console.log(move, snake)
            }
        })
        // console.log(trails)
        return trails.size + "";
    }
}

export default new Day9;