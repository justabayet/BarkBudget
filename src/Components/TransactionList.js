import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import Transaction from "./Transaction"

function TransactionList({ useValues }) {
    const { values, addValue, deleteValue, updateValue } = useValues()

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell align="right">
                            <IconButton color="primary" onClick={addValue}>
                                <AddIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {values?.map((expense, index) => (
                        <Transaction
                            key={index}
                            expense={expense}
                            index={index}
                            handleDelete={() => { deleteValue(expense, index) }}
                            handleSave={(updatedExpense) => { updateValue(updatedExpense, index) }}
                        ></Transaction>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TransactionList