import { Mode } from "./Mode"

export class MultipleDaysMode extends Mode {
    constructor({ start, end, amount }) {
        super({ amount })
        this.name = "multiple days"
        this.start = start
        this.end = end
    }
}