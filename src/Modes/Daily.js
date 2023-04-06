import { Mode } from "./Mode"

export class Daily extends Mode {
    constructor({ start, end, amount }) {
        super({ amount })
        this.name = "daily"
        this.start = start
        this.end = end
    }

    isValid(date) {
        return date > this.start && date < this.end
    }
}