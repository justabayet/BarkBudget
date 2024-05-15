import { Expectation } from "Providers/GraphValuesProvider"

export type ModeParameters = Expectation

export class Mode {
    name: string
    amount: number
    expectation: Expectation

    constructor(props: ModeParameters) {
        const { amount } = props
        this.expectation = props
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