import { Day } from "../day";

type Coord = {
    x: number
    y: number
}

const toS = (x: number, y: number): string => {
    return x + '-' + y
}

enum Block {
    WALL, SAND
}

type World = {
    world: Map<string, Block>
    minX: number
    maxX: number
    minY: number
    maxY: number
}

const updateBoundaries = (w: World, c: Coord): void => {
    if (c.x < w.minX) {
        w.minX = c.x
    }
    if (c.y < w.minY) {
        w.minY = c.y
    }
    if (c.x > w.maxX) {
        w.maxX = c.x
    }
    if (c.y > w.maxY) {
        w.maxY = c.y
    }
}

const within = (w: World, c: Coord): boolean => {
    // if (c.x < w.minX) {
    //     return false
    // }
    // if (c.y < w.minY) {
    //     return false
    // }
    // if (c.x > w.maxX) {
    //     return false
    // }
    if (c.y > w.maxY) {
        return false
    }
    return true
}

const dump = (w: World): void => {
    console.log()
    for (var y = 0; y <= w.maxY + 1; y++) {
        var line = ""
        for (var x = w.minX - 50; x <= w.maxX + 50; x++) {
            const b = w.world.get(toS(x, y))
            if (b === Block.SAND) {
                line += 'o'
            } else if (b === Block.WALL) {
                line += '#'
            } else {
                line += '.'
            }
        }
        console.log(line)
    }
    console.log()
}

const buildWorld = (input: string): World => {
    const w = { world: new Map(), minX: 999, maxX: -1, minY: 999, maxY: -1 }
    const lines = input.split(/\r?\n/)

    lines.forEach(line => {
        const v = line.split(' -> ')
            .map(c => {
                const bits = c.split(',')
                return { x: parseInt(bits[0]), y: parseInt(bits[1])}
            })
        for (var i = 0; i < v.length-1; i++) {
            updateBoundaries(w, v[i])
            updateBoundaries(w, v[i+1])

            if (v[i].x < v[i+1].x) {
                // right
                // console.log('right', v[i], v[i+1])
                for (var x = v[i].x; x <= v[i+1].x; x++) {
                    w.world.set(toS(x, v[i].y), Block.WALL)
                }
            } else if (v[i].x > v[i+1].x) {
                // left
                // console.log('left', v[i], v[i+1])
                for (var x = v[i+1].x; x <= v[i].x; x++) {
                    w.world.set(toS(x, v[i].y), Block.WALL)
                }
            } else {
                if (v[i].y < v[i+1].y) {
                    // down
                    // console.log('down', v[i], v[i+1])
                    for (var y = v[i].y; y <= v[i+1].y; y++) {
                        w.world.set(toS(v[i].x, y), Block.WALL)
                    }
                } else if (v[i].y > v[i+1].y) {
                    // up
                    // console.log('up', v[i], v[i+1])
                    for (var y = v[i+1].y; y <= v[i].y; y++) {
                        w.world.set(toS(v[i].x, y), Block.WALL)
                    }
                }
            }
        }
    })
    return w
}

const addFloor = (w: World): void => {
    w.maxY += 2
    for (var x = w.minX - 1000; x <= w.maxX + 1000; x++) {
        w.world.set(toS(x, w.maxY), Block.WALL)
    }
}

const dropSand = (w: World, p: Coord): Coord => {
    var current:Coord = { x: p.x, y: p.y }
    while (true) {
        // down
        current.y++
        if (!within(w, current)) {
            break
        }
        const down = w.world.get(toS(current.x, current.y))
        // console.log('down', current, down)
        if (down !== Block.WALL && down !== Block.SAND) {
            continue
        }
        // down-left
        current.x--
        if (!within(w, current)) {
            break
        }
        const downLeft = w.world.get(toS(current.x, current.y))
        // console.log('dl', current, downLeft)
        if (downLeft !== Block.WALL && downLeft !== Block.SAND) {
            continue
        }
        // down-right
        current.x += 2
        if (!within(w, current)) {
            break
        }
        const downRight = w.world.get(toS(current.x, current.y))
        // console.log('dr', current, downRight)
        if (downRight !== Block.WALL && downRight !== Block.SAND) {
            continue
        }
        // all blocked, return original
        current.x--
        current.y--
        break
    }

    return current
}

class Day14 extends Day {

    constructor(){
        super(14);
    }

    solveForPartOne(input: string): string {
        const w = buildWorld(input)
        var count = 0
        while (count < 900) {
            count++
            const rest = dropSand(w, {x: 500, y: 0})
            if (!within(w, rest)) {
                console.log(rest, "is out of bounds")
                break
            }
            w.world.set(toS(rest.x, rest.y), Block.SAND)
            // console.log(rest)
        }
        // dump(w)
        console.log(count-1)
        return "";
    }

    solveForPartTwo(input: string): string {
        const w = buildWorld(input)
        addFloor(w)
        var count = 0
        while (count < 100500) {
            count++
            const rest = dropSand(w, {x: 500, y: 0})
            if (rest.x == 500 && rest.y == 0) {
                w.world.set(toS(rest.x, rest.y), Block.SAND)
                console.log(rest, "perfect pyramid")                
                break
            }
            w.world.set(toS(rest.x, rest.y), Block.SAND)
            // console.log(rest)
        }
        console.log(w.minX, w.maxX, w.minY, w.maxY)
        dump(w)
        console.log(count)
        return "";
    }
}

export default new Day14;