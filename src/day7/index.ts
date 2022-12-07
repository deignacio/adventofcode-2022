import { Day } from "../day";

type File = {
    name: string
    size: number
}

type Dir = {
    name: string
    dirs: Array<Dir>
    files: Array<File>
    size: number
}

const parseInput = (lines:Array<string>): Map<string, Dir> => {
    const dirs: Map<string, Dir> = new Map()
    var name: Array<string> = []
    var current: Dir;
    for (var i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('$ cd')) {
            const subdir = line.slice(5)
            if (subdir == '..') {
                const oldSize = current!.size
                const oldDir = current!
                name.pop()
                current = dirs.get(name.join('/'))!
                current.dirs.push(oldDir)
                current.size += oldSize
                continue
            }
            name.push(subdir)
            current = { name: name.join('/'), dirs: [], files: [], size: 0 }
            dirs.set(current.name, current)
        } else if (line.startsWith('$ ls')) {
            //
        } else if (line.startsWith('dir')) {
            // is a dir, ignore?
        } else {
            // file?
            const spec = line.split(' ')
            const size = parseFloat(spec[0])
            current!.files.push({ name: spec[1], size: size })
            current!.size += size
        }
    }
    while (name.length > 0) {
        const oldSize = current!.size
        const oldDir = current!
        name.pop()
        current = dirs.get(name.join('/'))!
        if (current !== undefined) {
            current.dirs.push(oldDir)
            current.size += oldSize
        }
    }
    return dirs
}


class Day7 extends Day {

    constructor(){
        super(7);
    }

    solveForPartOne(input: string): string {
        const lines = input.split(/\r?\n/)
        const dirs = parseInput(lines)
        // console.log(dirs)
        var sum = 0
        dirs.forEach(dir => {
            if (dir.size <= 100000) {
                sum += dir.size
            }
        })

        return sum + "";
    }

    solveForPartTwo(input: string): string {
        const lines = input.split(/\r?\n/)
        const dirs = parseInput(lines)
        // console.log(dirs)
        const total = 70000000
        const desired = 30000000
        const actual = dirs.get('/')!.size
        const gap = actual - total + desired
        const values = [...dirs.values()]
        const sorted = values.sort((a, b) => {
            if (a.size < b.size) {
                return 1
            } else if (a.size > b.size) {
                return -1
            } else {
                return 0
            }
        })
        // console.log(total, desired, actual, gap)
        while (sorted.length > 0) {
            const dir = sorted.pop()!
            if (dir.size > gap) {
                return "" + dir.size + " > " + gap
            }
        }
        // console.log(sorted)
        return ""
    }
}

export default new Day7;