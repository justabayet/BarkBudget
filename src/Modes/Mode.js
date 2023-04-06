
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
}