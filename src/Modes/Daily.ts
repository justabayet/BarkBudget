import { Mode, ModeParameters } from './Mode'

export class Daily extends Mode {
    name: string
    startDate: Date
    endDate: Date

    constructor(expectation: ModeParameters) {
        super(expectation)
        const { startDate, endDate } = expectation
        this.name = 'daily'
        this.startDate = startDate
        this.endDate = endDate
    }

    isValid(date: Date): boolean {
        return date >= this.startDate && date <= this.endDate
    }
}