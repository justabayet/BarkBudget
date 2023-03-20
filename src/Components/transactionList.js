import { useState } from "react";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Transaction from "./transaction";


function TransactionList() {
    const [expenses, setExpenses] = useState([
        { date: "2022-01-01", amount: "100" },
        { date: "2022-01-02", amount: "200" },
        { date: "2022-01-03", amount: "300" }
    ]);
    const [newExpense, setNewExpense] = useState({ date: "2022-01-03", amount: "0" });

    const handleAddExpense = () => {
        setExpenses([newExpense, ...expenses]);
        setNewExpense({ date: "2022-01-03", amount: "0" });
    };

    const handleDeleteExpense = (index) => {
        const updatedExpenses = [...expenses];
        updatedExpenses.splice(index, 1);
        setExpenses(updatedExpenses);
    };

    const handleSaveRow = (date, amount, index) => {
        const oDate = expenses[index].date
        const oAmount = expenses[index].amount

        if (oDate !== date || oAmount !== amount) {
            const updatedExpenses = [...expenses];
            updatedExpenses[index] = { date, amount };
            setExpenses(updatedExpenses);
        }
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell align="right">
                            <IconButton color="primary" onClick={handleAddExpense}>
                                <AddIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.map((expense, index) => (
                        <Transaction
                            key={index}
                            expense={expense}
                            index={index}
                            handleDelete={() => { handleDeleteExpense(index) }}
                            handleSave={(date, amount) => { handleSaveRow(date, amount, index) }}
                        ></Transaction>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TransactionList;