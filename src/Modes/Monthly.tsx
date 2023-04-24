import { Mode } from "./Mode"

interface MonthlyParameters {
    startDate: Date
    endDate: Date
    amount: number
}

export class Monthly extends Mode {
    name: string
    startDate: Date
    endDate: Date

    constructor({ startDate, endDate, amount }: MonthlyParameters) {
        super({ amount })
        this.name = "monthly"
        this.startDate = startDate
        this.endDate = endDate
    }

    isValid(date: Date): boolean {
        return date > this.startDate && date < this.endDate && date.getDate() === 1
    }
}