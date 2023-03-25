
export class Mode {
    constructor({ amount = 0 }) {
        this.amount = amount
        this.name = "default"
    }

    getIcon() {
        console.log("Mode getIcon")
    }

    isValid(date) {
        return true
    }

    getAmount(date) {
        if (this.isValid(date)) {
            return this.amount
        }
        return 0
    }

    static compareDate(date1, date2) {
        return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
    }
}