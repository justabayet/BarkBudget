import React from "react"
import { Box, Typography, Collapse, IconButton, List } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { TransitionGroup } from "react-transition-group"
import { GenericEntry, GenericValuesContext, TransactionType } from "../../Providers/GraphValuesProvider/GenericValues"

interface TransactionListProps<Transaction extends TransactionType> {
    useValues: (() => GenericValuesContext<Transaction>)
    ChildComponent: GenericEntry<Transaction>
}

type TransactionListType = <Transaction extends TransactionType>({ useValues, ChildComponent }: TransactionListProps<Transaction>) => JSX.Element

const TransactionList: TransactionListType = ({ useValues, ChildComponent }) => {
    const { values, addValue, deleteValue, updateValue } = useValues()

    return (
        <List>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                <Typography>Entries</Typography>

                <IconButton color="primary" onClick={addValue} style={{ "marginLeft": "auto" }}>
                    <AddIcon />
                </IconButton>
            </Box>

            <TransitionGroup>
                {values?.map((value, index) => {
                    return (
                        <Collapse key={value.id}>
                            <ChildComponent
                                value={value}
                                handleDelete={() => { deleteValue(value, index) }}
                                handleSave={(updatedValue) => { updateValue(updatedValue, index) }} />
                        </Collapse>
                    )
                })}
            </TransitionGroup>
        </List>
    )
}

export default TransactionList