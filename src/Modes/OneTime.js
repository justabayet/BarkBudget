import { compareDate } from "../helpers"
import { Mode } from "./Mode"

export class OneTime extends Mode {
    constructor({ startDate, amount }) {
        super({ amount })
        this.name = "one time"
        if (startDate instanceof Date) {
            this.date = startDate
        } else {
            this.date = new Date(startDate)
        }
    }

    isValid(date) {
        return compareDate(date, this.date)
    }
}