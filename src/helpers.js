
export function getFormattedDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateOfMonth = date.getDate()

    return `${year}-${month}-${dateOfMonth}`
}