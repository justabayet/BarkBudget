import { Box, Typography, Collapse, IconButton, List } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { TransitionGroup } from "react-transition-group"

function TransactionList({ useValues, ChildComponent }) {
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
                {values?.map((value, index) => (
                    <Collapse key={index}>
                        <ChildComponent
                            value={value}
                            handleDelete={() => { deleteValue(value, index) }}
                            handleSave={(updatedValue) => { updateValue(updatedValue, index) }} />
                    </Collapse>
                ))}
            </TransitionGroup>
        </List>
    )
}

export default TransactionList