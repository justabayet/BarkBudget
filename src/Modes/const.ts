import { Daily } from "./Daily"
import { Monthly } from "./Monthly"
import { OneTime } from "./OneTime"

export type ModeType = 'One time' | 'Daily' | 'Monthly'

export const modeNames: Record<string, ModeType> = {
    ONE_TIME: 'One time',
    DAILY: 'Daily',
    MONTHLY: 'Monthly'
}

export const modes = {
    [modeNames.ONE_TIME]: OneTime,
    [modeNames.DAILY]: Daily,
    [modeNames.MONTHLY]: Monthly,
}