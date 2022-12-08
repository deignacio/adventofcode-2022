import { maxHeaderSize } from "http";
import { toASCII } from "punycode";
import { Day } from "../day";

type Coord = {
    x: number
    y: number
}

const toS = (coord: Coord): string => {
    return "(" + coord.x + "," + coord.y + ")"
}

type Forest = {
    coords: Array<Coord>
    trees: Map<string, number>
    maxX: number
    maxY: number
}

const isVisible = (coord: Coord, forest: Forest): boolean => {
    if ((coord.x == 0) ||
        (coord.x == forest.maxX) ||
        (coord.y == 0) ||
        (coord.y == forest.maxY)) {
        return true
    }
    const trees = forest.trees
    const height = trees.get(toS(coord))!
    // console.log("tree", coord, height)
    
    // from top
    var fromTop = true;
    for (var y = 0; y < coord.y; y++) {
        const c: Coord = {x: coord.x, y: y}
        const tree = trees.get(toS(c))!
        // console.log("fromTop", c, tree)
        if (tree >= height) {
            fromTop = false
            break
        }
    }

    // from left
    var fromLeft = true
    for (var x = 0; x < coord.x; x++) {
        const c: Coord = {x: x, y: coord.y}
        const tree = trees.get(toS(c))!
        // console.log("fromLeft", c, tree)
        if (tree >= height) {
            fromLeft = false
            break
        }
    }

    // from bottom
    var fromBottom = true
    for (var y = forest.maxY; y > coord.y; y--) {
        const c: Coord = {x: coord.x, y: y}
        const tree = trees.get(toS(c))!
        // console.log("fromBottom", c, tree)
        if (tree >= height) {
            fromBottom = false
            break
        }
    
    }
    
    // from right
    var fromRight = true
    for (var x = forest.maxX; x > coord.x; x--) {
        const c: Coord = {x: x, y: coord.y}
        const tree = trees.get(toS(c))!
        // console.log("fromRight", c, tree)
        if (tree >= height) {
            fromRight = false
            break
        }
        
    }

    return fromTop || fromLeft || fromBottom || fromRight
}

const scenicScore = (coord: Coord, forest: Forest): number => {
    if ((coord.x == 0) ||
        (coord.x == forest.maxX) ||
        (coord.y == 0) ||
        (coord.y == forest.maxY)) {
        return 0
    }
    const trees = forest.trees
    const height = trees.get(toS(coord))!
    // console.log("tree", coord, height)
    
    // up
    var up = coord.y;
    for (var y = coord.y - 1; y >= 0; y--) {
        const c: Coord = {x: coord.x, y: y}
        const tree = trees.get(toS(c))!
        // console.log("up", c, tree)
        if (tree >= height) {
            up = coord.y - y
            break
        }
    }

    // left
    var left = coord.x
    for (var x = coord.x - 1; x >= 0; x--) {
        const c: Coord = {x: x, y: coord.y}
        const tree = trees.get(toS(c))!
        // console.log("left", c, tree)
        if (tree >= height) {
            left = coord.x - x
            break
        }
    }
    
    // down
    var down = forest.maxY - coord.y;
    for (var y = coord.y + 1; y <= forest.maxY; y++) {
        const c: Coord = {x: coord.x, y: y}
        const tree = trees.get(toS(c))!
        if (tree >= height) {
            down = y - coord.y
            break
        }
    }

    // right
    var right = forest.maxX - coord.x
    for (var x = coord.x + 1; x <= forest.maxX; x++) {
        const c: Coord = {x: x, y: coord.y}
        const tree = trees.get(toS(c))!
        // console.log("right", c, tree)
        if (tree >= height) {
            right = x - coord.x
            break
        }
        
    }
    // console.log(coord, up, left, down, right)
    return left * right * up * down
}

const buildForest = (lines: Array<string>): Forest => {
    const trees: Map<string, number> = new Map()
    var maxX = lines[0].length - 1
    var maxY = lines.length - 1
    const coords: Array<Coord> = []
    for (var y = 0; y <= maxY; y++) {
        const line = lines[y]
        for (var x = 0; x <= maxX; x++) {
            const coord: Coord = { x, y }
            coords.push(coord)
            trees.set(toS(coord), parseInt(line[x]))
        }
    }
    return { trees: trees, maxX: maxX, maxY: maxY, coords: coords }
}

class Day8 extends Day {

    constructor(){
        super(8);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        const forest = buildForest(lines)
        // console.log(forest)
        const visibility: Map<Coord, boolean> = new Map()
        var totalVisible = 0
        forest.coords.forEach(coord => {
            const visible = isVisible(coord, forest)
            // console.log(coord, visible)
            if (visible) {
                totalVisible++
            }
            visibility.set(coord, visible)
        })
        // console.log(visibility)
        return "" + totalVisible;
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        const forest = buildForest(lines)
        // console.log(forest)
        const scenicScores: Map<Coord, number> = new Map()
        var maxScore = -1
        forest.coords.forEach(coord => {
            const score = scenicScore(coord, forest)
            console.log(coord, score)
            if (score > maxScore) {
                maxScore = score
            }
            scenicScores.set(coord, score)
        })
        console.log(scenicScores)
        return "" + maxScore;
    }
}

export default new Day8;