import { Mode } from "./Mode"

export class Monthly extends Mode {
    constructor({ startDate, endDate, amount }) {
        super({ amount })
        this.name = "monthly"
        this.startDate = startDate
        this.endDate = endDate
    }

    isValid(date) {
        return date > this.startDate && date < this.endDate && date.getDate() === 1
    }
}