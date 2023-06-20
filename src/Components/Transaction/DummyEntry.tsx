import { Divider, Typography } from "@mui/material"
import React from "react"

interface DummyEntryProps {
    id: string | undefined
}

const DummyEntry = ({ id }: DummyEntryProps) => {
    switch (id) {
        case "startRecords":
            return <Divider sx={{ mt: 1.5, mb: -1.5 }}><Typography variant='caption'>Last Recorded Date</Typography></Divider>

        case "startScenario":
            return <Divider sx={{ mt: 1.5, mb: -1.5 }}><Typography variant='caption'>Scenario Start Date</Typography></Divider>

        case "endScenario":
            return <Divider sx={{ mt: 1.5, mb: -1.5 }}><Typography variant='caption'>Scenario End Date</Typography></Divider>

        default:
            break
    }
}

export default DummyEntry

