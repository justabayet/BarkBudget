import { Mode } from "./Mode"

export class DailyMode extends Mode {
    constructor({ start, end, amount }) {
        super({ amount })
        this.name = "daily"
        this.start = start
        this.end = end
    }
}