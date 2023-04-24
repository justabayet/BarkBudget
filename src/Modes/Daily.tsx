import { Mode } from "./Mode"

interface DailyParameters {
    startDate: Date
    endDate: Date
    amount: number
}

export class Daily extends Mode {
    name: string
    startDate: Date
    endDate: Date

    constructor({ startDate, endDate, amount }: DailyParameters) {
        super({ amount })
        this.name = "daily"
        this.startDate = startDate
        this.endDate = endDate
    }

    isValid(date: Date): boolean {
        return date >= this.startDate && date <= this.endDate
    }
}