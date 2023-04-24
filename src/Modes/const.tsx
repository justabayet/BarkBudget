import { OneTime } from "./OneTime"
import { Daily } from "./Daily"
import { Monthly } from "./Monthly"


export const modeNames = {
    ONE_TIME: "One time",
    DAILY: "Daily",
    MONTHLY: "Monthly"
}

export const modes = {
    [modeNames.ONE_TIME]: OneTime,
    [modeNames.DAILY]: Daily,
    [modeNames.MONTHLY]: Monthly,
}