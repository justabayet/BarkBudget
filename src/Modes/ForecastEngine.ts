import { Expectation } from 'Providers/GraphValuesProvider'
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
            const influences: Expectation[] = []

            this.modeEntries.forEach((modeEntry) => {
                diff += modeEntry.getAmount(currentDate)
                if (modeEntry.isValid(currentDate)) influences.push(modeEntry.expectation)
            })

            currentBalance += diff

            this.values.push(new AmountEntry(new Date(currentDate), currentBalance, influences))

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
    influences: Expectation[]

    constructor(date: Date, value: number, influences: Expectation[]) {
        this.date = date
        this.value = value
        this.influences = influences
    }
}