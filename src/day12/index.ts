import { maxHeaderSize } from "http";
import { toUSVString } from "util";
import { Day } from "../day";

const order: string = "abcdefghijklmnopqrstuvwxyz"

type Coord = {
    x: number
    y: number
}

const toS = (c: Coord): string => {
    return c.x + "-" + c.y
}
const toC = (s: string): Coord => {
    const bits = s.split('-')
    return { x: parseInt(bits[0]), y: parseInt(bits[1]) }
}
type HeightMap = {
    start: Coord
    end: Coord
    maxX: number
    maxY: number
    heights: Map<string, number>
}

type Traversal = {
    distance: Map<string, number>
    toVisit: Array<string>
}

const buildHeightMap = (input: string): HeightMap => {
    var start: Coord
    var end: Coord
    const heights: Map<string, number> = new Map()
    const lines = input.split(/\r?\n/)
    const maxX = lines[0].length
    const maxY = lines.length
    var current: Coord
    var elevation: string
    for (var y = 0; y < maxY; y++) {
        for (var x = 0; x < maxX; x++) {
            current = { x: x, y: y }
            elevation = lines[y][x]
            if (elevation == 'S') { 
                start = current
                elevation = 'a'
            } else if (elevation == 'E') {
                end = current
                elevation = 'z'
            }
            heights.set(toS(current), order.indexOf(elevation))
        }
    }

    return { 
        start: start!, 
        end: end!, 
        maxX: maxX,
        maxY: maxY,
        heights: heights 
    }
}

const getNextToVisit = (traversal: Traversal, heightMap: HeightMap, current: Coord): Array<Coord> => {
    const toVisit = [
        {x: current.x - 1, y: current.y},
        {x: current.x + 1, y: current.y},
        {x: current.x, y: current.y - 1},
        {x: current.x, y: current.y + 1},
    ].filter(c => c.x >= 0)
        .filter(c => c.x < heightMap.maxX)
        .filter(c => c.y >= 0)
        .filter(c => c.y < heightMap.maxY)
        .filter(c => !traversal.distance.has(toS(c)))
    // console.log(current, toVisit)
    return toVisit
}

const calculateDistance = (traversal: Traversal, heightMap: HeightMap, current: Coord): number => {
    if (traversal.distance.has(toS(current))) {
        return traversal.distance.get(toS(current))!
    }
    const elevation = heightMap.heights.get(toS(current))!
    const distances = [
        {x: current.x - 1, y: current.y},
        {x: current.x + 1, y: current.y},
        {x: current.x, y: current.y - 1},
        {x: current.x, y: current.y + 1},
    ].filter(c => traversal.distance.has(toS(c)))
    .filter(c => heightMap.heights.get(toS(c))! - elevation <= 1)
    .map(c => traversal.distance.get(toS(c))!)
    .sort()
    if (distances.length > 0) {
        return distances[0] + 1
    } else {
        return -1
    }
}
class Day12 extends Day {

    constructor(){
        super(12);
    }

    solveForPartOne(input: string): string {
        const heightMap = buildHeightMap(input)
        // console.log(heightMap)
        const traversal: Traversal = {
            distance: new Map(),
            toVisit: []
        }
        traversal.distance.set(toS(heightMap.end), 0)
        getNextToVisit(traversal, heightMap, heightMap.end)
            .forEach(c => traversal.toVisit.push(toS(c)))
        var maxDistance = -1
        while (traversal.toVisit.length > 0) {
            const current = toC(traversal.toVisit.splice(0, 1)[0])
            const distance = calculateDistance(traversal, heightMap, current)
            if (distance > maxDistance) {
                // console.log(current, distance, traversal.toVisit.length)
                maxDistance = distance
            }
            if (distance > 0) {
                traversal.distance.set(toS(current), distance)
                const next = [...getNextToVisit(traversal, heightMap, current)]
                next.map(c => toS(c))
                    .filter(c => !traversal.toVisit.includes(c))
                    .forEach(c => traversal.toVisit.push(c))
            }
        }
        console.log(traversal)
        return ""
    }

    solveForPartTwo(input: string): string {
        const heightMap = buildHeightMap(input)
        // console.log(heightMap)
        const traversal: Traversal = {
            distance: new Map(),
            toVisit: []
        }
        traversal.distance.set(toS(heightMap.end), 0)
        getNextToVisit(traversal, heightMap, heightMap.end)
            .forEach(c => traversal.toVisit.push(toS(c)))
        var maxDistance = -1
        while (traversal.toVisit.length > 0) {
            const current = toC(traversal.toVisit.splice(0, 1)[0])
            const distance = calculateDistance(traversal, heightMap, current)
            if (distance > maxDistance) {
                // console.log(current, distance, traversal.toVisit.length)
                maxDistance = distance
            }
            if (distance > 0) {
                traversal.distance.set(toS(current), distance)
                const next = [...getNextToVisit(traversal, heightMap, current)]
                next.map(c => toS(c))
                    .filter(c => !traversal.toVisit.includes(c))
                    .forEach(c => traversal.toVisit.push(c))
            }
        }
        var key: string
        var dist: number = 9999
        traversal.distance.forEach((v, k) => {
            if (heightMap.heights.get(k) == order.indexOf('a')) {
                if (v < dist) {
                    key = k
                    dist = v
                }
            }
        })
        console.log(traversal, dist)
        return ""
    }
}

export default new Day12;