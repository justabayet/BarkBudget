import { Mode } from './Mode'

export class ForecastEngine {
    startDate: Date
    endDate: Date
    startAmount: number
    values: AmountEntry[]
    modeEntries: Mode[]

    constructor(startDate: Date, endDate: Date, startAmount: number) {
        this.startDate = startDate
        this.endDate = endDate
        this.startAmount = startAmount

        this.values = []
        this.modeEntries = []
    }

    iterate(): void {
        let currentDate: Date = new Date(this.startDate)

        this.values = []

        let currentBalance: number = this.startAmount

        while (currentDate <= this.endDate) {

            let diff: number = 0
            this.modeEntries.map((modeEntry) => diff += modeEntry.getAmount(currentDate))

            currentBalance += diff

            this.values.push(new AmountEntry(new Date(currentDate), currentBalance))

            currentDate.setDate(currentDate.getDate() + 1)
        }
    }

    addEntry(modeEntry: Mode): void {
        this.modeEntries.push(modeEntry)
    }

    cleanEntries(): void {
        this.modeEntries = []
    }
}

class AmountEntry {
    date: Date
    value: number

    constructor(date: Date, value: number) {
        this.date = date
        this.value = value
    }
}