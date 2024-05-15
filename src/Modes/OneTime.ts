import { compareDate } from 'helpers'
import { Mode, ModeParameters } from './Mode'

export class OneTime extends Mode {
    name: string
    date: Date

    constructor(expectation: ModeParameters) {
        super(expectation)
        const { startDate } = expectation
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