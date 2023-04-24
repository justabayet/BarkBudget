import { Mode } from "./Mode"

interface PeriodParameters {
    startDate: Date
    endDate: Date
    amount: number
}

export class Period extends Mode {
    name: string
    startDate: Date
    endDate: Date

    constructor({ startDate, endDate, amount }: PeriodParameters) {
        super({ amount })
        this.name = "period"
        this.startDate = startDate
        this.endDate = endDate
    }
}