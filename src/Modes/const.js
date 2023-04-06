import { OneTime } from "./OneTime"
import { Daily } from "./Daily"


export const modeNames = {
    ONE_TIME: "One time",
    DAILY: "Daily"
}

export const modes = {
    [modeNames.ONE_TIME]: OneTime,
    [modeNames.DAILY]: Daily,
}