import { Mode } from "./Mode"

export class PeriodMode extends Mode {
    constructor({ start, end, amount }) {
        super({ amount })
        this.name = "period"
        this.start = start
        this.end = end
    }
}