
interface ModeParameters {
    amount: number
}

export class Mode {
    name: string
    amount: number

    constructor({ amount = 0 }: ModeParameters) {
        this.amount = amount
        this.name = 'default'
    }

    getIcon() {
        console.log('Mode getIcon')
    }

    isValid(date: Date): boolean {
        return true
    }

    getAmount(date: Date): number {
        if (this.isValid(date)) {
            return this.amount
        }
        return 0
    }
}