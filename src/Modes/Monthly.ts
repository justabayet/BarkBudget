import { Mode } from './Mode'

interface MonthlyParameters {
    startDate: Date
    endDate: Date
    amount: number
    updateDay?: number
}

export class Monthly extends Mode {
    name: string
    startDate: Date
    endDate: Date
    updateDay: number

    constructor({ startDate, endDate, amount, updateDay }: MonthlyParameters) {
        super({ amount })
        this.name = 'monthly'
        this.startDate = startDate
        this.endDate = endDate
        this.updateDay = updateDay ?? 1
    }

    isValid(date: Date): boolean {
        return date > this.startDate && date < this.endDate && date.getDate() === this.updateDay
    }
}