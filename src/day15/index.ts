import { Day } from "../day";

type Coord = {
    x: number
    y: number
}

type Closest = {
    sensor: Coord
    beacon: Coord
}

const toS = (x: number, y: number): string => {
    return x + '-' + y
}

enum Block {
    SENSOR, BEACON, EMPTY
}

type World = {
    world: Map<string, Block>
    pairs: Array<Closest>
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

const buildWorld = (input: string): World => {
    const w: World = { world: new Map(), pairs: [], minX: 999, maxX: -1, minY: 999, maxY: -1 }
    const lines = input.split(/\r?\n/)

    lines.forEach(line => {
        const v = line.split(' ')
        // ['Sensor', 'at', 'x=2,', 'y=18:', 'closest', 'beacon', 'is', 'at', 'x=-2,', 'y=15']
        const sensor = {
            x: parseInt(v[2].split(',')[0].split('=')[1]), 
            y: parseInt(v[3].split(':')[0].split('=')[1])
        }
        updateBoundaries(w, sensor)
        const beacon = {
            x: parseInt(v[8].split(',')[0].split('=')[1]), 
            y: parseInt(v[9].split(':')[0].split('=')[1])
        }
        updateBoundaries(w, beacon)
        w.world.set(toS(sensor.x, sensor.y), Block.SENSOR)
        w.world.set(toS(beacon.x, beacon.y), Block.BEACON)
        w.pairs.push({ sensor: sensor, beacon: beacon })
    })
    return w
}

// too expensive
const implyEmpty = (w: World, c: Closest): void => {
    const distance = Math.abs(c.sensor.x - c.beacon.x) + Math.abs(c.sensor.y - c.beacon.y)
    for (var dx = 0; dx <= distance; dx++) {
        var dy = distance - dx
        // down -> right
        for (var x = c.sensor.x; x <= c.sensor.x + dx; x++) {
            for (var y = c.sensor.y; y <= c.sensor.y + dy; y++) {
                w.world.set(toS(x, y), Block.EMPTY)
            }
        }
        // down -> left
        for (var x = c.sensor.x - dx; x <= c.sensor.x; x++) {
            for (var y = c.sensor.y; y <= c.sensor.y + dy; y++) {
                w.world.set(toS(x, y), Block.EMPTY)
            }
        }
        // up -> right
        for (var x = c.sensor.x; x <= c.sensor.x + dx; x++) {
            for (var y = c.sensor.y - dy; y <= c.sensor.y; y++) {
                w.world.set(toS(x, y), Block.EMPTY)
            }
        }
        // up -> left
        for (var x = c.sensor.x - dx; x <= c.sensor.x; x++) {
            for (var y = c.sensor.y - dy; y <= c.sensor.y; y++) {
                w.world.set(toS(x, y), Block.EMPTY)
            }
        }
    }
    w.world.set(toS(c.sensor.x, c.sensor.y), Block.SENSOR)
    w.world.set(toS(c.beacon.x, c.beacon.y), Block.BEACON)
}

const manhattanDistance = (a: Coord, b: Coord): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const isExcluded = (w: World, c: Coord): boolean => {
    const excluded = w.pairs.map(p => {
        const toBeacon = manhattanDistance(p.sensor, p.beacon)
        const toCoord = manhattanDistance(p.sensor, c)
        // if (toBeacon >= toCoord) {
            // console.log(w.minX, w.maxX, p.sensor, toBeacon, p.beacon, toCoord, c)
        // }
        return toBeacon >= toCoord
    })
    return excluded.indexOf(true) != -1
}

const dump = (w: World): void => {
    console.log()
    for (var y = w.minY; y <= w.maxY; y++) {
        var line = "\t" + y + "\t"
        for (var x = w.minX; x <= w.maxX; x++) {
            const b = w.world.get(toS(x, y))
            if (b === Block.SENSOR) {
                line += 'S'
            } else if (b === Block.BEACON) {
                line += 'B'
            } else if (b === Block.EMPTY) {
                line += 'E'
            } else {
                line += '.'
            }
        }
        console.log(line)
    }
    console.log()
}

class Day15 extends Day {

    constructor(){
        super(15);
    }

    solveForPartOne(input: string): string {
        const w = buildWorld(input)
        // dump(w)
        // don't do this, it's too expensive
        // w.pairs.forEach(closest => {
        //     console.log(closest)
        //     implyEmpty(w, closest)
        //     // dump(w)
        // })
        // dump(w)
        var count = 0
        var target = 2000000
        // var target = 10
        for (var x = w.minX-10000000; x <= w.maxX+10000000; x++) {
            if (x >= w.minX && x <= w.maxX) {
                const b = w.world.get(toS(x, target))
                if ((b === Block.BEACON) || (b === Block.SENSOR)) {
                    continue
                }
            }
            if (isExcluded(w, {x: x, y:target})) {
                count++
            }
        }
        return ""+count;
    }

    solveForPartTwo(input: string): string {
        const w = buildWorld(input)
        w.minX = 0
        w.maxX = 4000000
        // w.maxX = 20
        w.minY = 0
        w.maxY = 4000000
        // w.maxY = 20
        for (var y = w.minY; y <= w.maxY; y++) {
            // if (y % 10000 == 0) {
            //     console.log(y)
            // }
            for (var x = w.minX; x <= w.maxX; x++) {
                const b = w.world.get(toS(x, y))
                if ((b === Block.BEACON) || (b === Block.SENSOR)) {
                    continue
                }
                var excluded = false
                for (var i = 0; i < w.pairs.length; i++) {
                    const p = w.pairs[i]
                    const toBeacon = manhattanDistance(p.sensor, p.beacon)
                    const toCoord = manhattanDistance(p.sensor, {x:x, y:y})
                    // excluded, let's jump to the other side of the diamond
                    if (toBeacon >= toCoord) {
                        const coordDy = Math.abs(p.sensor.y - y)
                        const dx = toBeacon - coordDy
                        x = p.sensor.x + dx
                        excluded = true
                    }
                }
                if (!excluded) {
                    // not excluded
                    // console.log({x:x, y:y}, x * 4000000 + y)
                    return x * 4000000 + y + ""
                }
            }
        }
        return "busted";
    }
}

export default new Day15;