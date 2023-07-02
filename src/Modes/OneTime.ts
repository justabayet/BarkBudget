import { compareDate } from 'helpers'
import { Mode } from './Mode'

interface OneTimeParameters {
    startDate: Date
    amount: number
}

export class OneTime extends Mode {
    name: string
    date: Date

    constructor({ startDate, amount }: OneTimeParameters) {
        super({ amount })
        this.name = 'one time'
        if (startDate instanceof Date) {
            this.date = startDate
        } else {
            this.date = new Date(startDate)
        }
    }

    isValid(date: Date): boolean {
        return compareDate(date, this.date)
    }
}