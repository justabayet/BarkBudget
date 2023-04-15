import { Mode } from "./Mode"

export class Daily extends Mode {
    constructor({ startDate, endDate, amount }) {
        super({ amount })
        this.name = "daily"
        this.startDate = startDate
        this.endDate = endDate
    }

    isValid(date) {
        return date >= this.startDate && date <= this.endDate
    }
}