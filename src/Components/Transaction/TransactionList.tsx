import AddIcon from '@mui/icons-material/Add'
import { Box, Collapse, Fab, IconButton, List, Typography } from "@mui/material"
import React from "react"
import { TransitionGroup } from "react-transition-group"
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { GenericEntry, GenericValuesContext, TransactionType } from "../../Providers/GraphValuesProvider/GenericValues"

interface TransactionListProps<Transaction extends TransactionType> {
    useValues: (() => GenericValuesContext<Transaction>)
    ChildComponent: GenericEntry<Transaction>
}

type TransactionListType = <Transaction extends TransactionType>({ useValues, ChildComponent }: TransactionListProps<Transaction>) => JSX.Element

const TransactionList: TransactionListType = ({ useValues, ChildComponent }) => {
    const { values, addValue, deleteValue, updateValue } = useValues()
    const { isMobile } = useDeviceDetails()

    return (
        <List>
            {isMobile ?
                <>
                    <Fab sx={{
                        position: 'fixed',
                        bottom: 72,
                        right: 16,
                    }} color="info" aria-label="add" onClick={addValue}>
                        <AddIcon />
                    </Fab>
                    {(!values || values.length === 0) &&
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-around", height: "300px" }}>
                            <Typography sx={{ color: '#333333', fontWeight: 400, opacity: 0.38, fontSize: 26, textAlign: "center" }}>
                                Press the + button to add an element
                            </Typography>
                        </Box>}
                </>
                :
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    {(!values || values.length === 0) &&
                        <Typography sx={{ color: '#333333', fontWeight: 400, opacity: 0.38 }}>No elements yet</Typography>}
                    <IconButton color="primary" onClick={addValue} style={{ "marginLeft": "auto" }}>
                        <AddIcon />
                    </IconButton>
                </Box>
            }

            {(values && values.length > 0) &&
                <TransitionGroup>
                    {values?.map((value, index) => {
                        return (
                            <Collapse key={value.id} sx={{ pb: 3 }}>
                                <ChildComponent
                                    value={value}
                                    handleDelete={() => { deleteValue(value, index) }}
                                    handleSave={(updatedValue) => { updateValue(updatedValue, index) }} />
                            </Collapse>
                        )
                    })}
                </TransitionGroup>
            }
        </List>
    )
}

export default TransactionList