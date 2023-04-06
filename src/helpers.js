
export function getFormattedDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateOfMonth = date.getDate()

    return `${year}-${month}-${dateOfMonth}`
}


export function compareDate(date1, date2) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}