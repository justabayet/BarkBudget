export class ForecastEngine {
    constructor(startDate, endDate, startAmount) {
        this.startDate = startDate
        this.startAmount = startAmount
        this.endDate = endDate

        this.values = []
        this.modeEntries = []
    }

    iterate() {
        let currentDate = this.startDate

        this.values = []

        let currentBalance = this.startAmount

        while (this.startDate <= this.endDate) {

            let diff = 0
            this.modeEntries.map((modeEntry) => diff += modeEntry.getAmount(currentDate))

            currentBalance += diff

            this.values.push(new AmountEntry(new Date(currentDate), currentBalance))
            // Increment current date by 1 day
            currentDate.setDate(currentDate.getDate() + 1)
        }
    }

    addEntry(modeEntry) {
        this.modeEntries.push(modeEntry)
    }

    cleanEntries() {
        this.modeEntries = []
    }
}

class AmountEntry {
    constructor(date, value) {
        this.date = date
        this.value = value
    }
}