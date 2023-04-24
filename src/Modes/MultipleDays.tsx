import { Mode } from "./Mode"

interface MultipleDaysParameters {
    startDate: Date
    endDate: Date
    amount: number
}

export class MultipleDays extends Mode {
    name: string
    startDate: Date
    endDate: Date

    constructor({ startDate, endDate, amount }: MultipleDaysParameters) {
        super({ amount })
        this.name = "multiple days"
        this.startDate = startDate
        this.endDate = endDate
    }
}