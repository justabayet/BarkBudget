export function getFormattedDate(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateOfMonth = date.getDate()

    return `${year}-${month}-${dateOfMonth}`
}

export function compareDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}

export function getValidDate(date?: Date): Date {
    if (date === undefined || isNaN(date.getTime())) {
        return new Date()
    }
    return date
}

export function generateRandomId() {
    const length = 28

    let id = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        id += characters.charAt(randomIndex)
    }

    return id
}

export function getOrdinal(number: number): string {
    switch (number % 10) {
        case 1:
            return "st"
        case 2:
            return "nd"
        case 3:
            return "rd"
        default:
            return "th"
    }
}