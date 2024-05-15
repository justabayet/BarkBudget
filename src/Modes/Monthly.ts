import { Mode, ModeParameters } from './Mode'

export class Monthly extends Mode {
    name: string
    startDate: Date
    endDate: Date
    updateDay: number

    constructor(expectation: ModeParameters) {
        super(expectation)
        const { startDate, endDate, updateDay } = expectation
        this.name = 'monthly'
        this.startDate = startDate
        this.endDate = endDate
        this.updateDay = updateDay ?? 1
    }

    isValid(date: Date): boolean {
        return date > this.startDate && date < this.endDate && date.getDate() === this.updateDay
    }
}