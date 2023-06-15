import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import React from "react"
import { modeNames } from "../../Modes/const"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { Expense } from "../../Providers/GraphValuesProvider/ExpensesProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"
import { compareDate, getFormattedDate } from "../../helpers"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"
import CustomTextField from '../Fields/CustomTextField'
import ModeSelector from "./ModeSelector"


const ExpenseEntry: GenericEntry<Expense> = ({ value, handleDelete, handleSave }) => {
    const { isBodyFullSize } = useDeviceDetails()

    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            {isBodyFullSize ?
                <>
                    <Card elevation={3}>
                        <CardActionArea onClick={handleClickOpen}>
                            <CardContent sx={{ p: 1 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography>{value.name}</Typography>
                                        <Typography>{value.amount}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography variant='caption'>{getFormattedDate(value.startDate)} {"-"} {getFormattedDate(value.endDate)}</Typography>
                                        <Typography variant='caption'>{value.mode}</Typography>
                                    </Box>
                                </Box>

                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                        <DialogTitle>Edit</DialogTitle>
                        <DialogContent>
                            <Box sx={{ pt: 1, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
                                <CustomTextField
                                    label={'Name'}
                                    text={value.name}
                                    setText={(newName) => {
                                        if (newName !== value.name) {
                                            console.log("new name")
                                            handleSave({ ...value, name: newName })
                                        }
                                    }} />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3}>
                                    <CustomDatePicker
                                        label={[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? 'Start Date' : 'Date'}
                                        date={value.startDate}
                                        setDate={(newDate) => {
                                            if (!compareDate(newDate, value.startDate)) {
                                                handleSave({ ...value, startDate: newDate })
                                            }
                                        }} />

                                    {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) &&
                                        <CustomDatePicker
                                            label='End Date'
                                            date={value.endDate}
                                            setDate={(newDate) => {
                                                if (!compareDate(newDate, value.endDate)) {
                                                    handleSave({ ...value, endDate: newDate })
                                                }
                                            }} />}
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3}>
                                    <AmountField
                                        label='Amount'
                                        amount={value.amount}
                                        setAmount={(newAmount) => {
                                            if (newAmount !== value.amount) {
                                                handleSave({ ...value, amount: newAmount })
                                            }
                                        }} />

                                    <ModeSelector
                                        label='Mode'
                                        mode={value.mode}
                                        setMode={(newMode) => {
                                            if (newMode !== value.mode) {
                                                handleSave({ ...value, mode: newMode })
                                            }
                                        }} />
                                </Box>

                                <Button sx={{ mt: 3 }} variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={() => {
                                    handleClose()
                                    handleDelete()
                                }}>Delete</Button>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined" autoFocus>Cancel</Button>
                            <Button onClick={handleClose} variant="contained" color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>

                :
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                    <CustomDatePicker
                        label={[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? 'Start Date' : 'Date'}
                        date={value.startDate}
                        setDate={(newDate) => {
                            if (!compareDate(newDate, value.startDate)) {
                                handleSave({ ...value, startDate: newDate })
                            }
                        }} />

                    {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) &&
                        <CustomDatePicker
                            label='End Date'
                            date={value.endDate}
                            setDate={(newDate) => {
                                if (!compareDate(newDate, value.endDate)) {
                                    handleSave({ ...value, endDate: newDate })
                                }
                            }} />
                    }


                    <AmountField
                        label='Amount'
                        amount={value.amount}
                        setAmount={(newAmount) => {
                            if (newAmount !== value.amount) {
                                handleSave({ ...value, amount: newAmount })
                            }
                        }} />

                    <ModeSelector
                        label='Mode'
                        mode={value.mode}
                        setMode={(newMode) => {
                            if (newMode !== value.mode) {
                                handleSave({ ...value, mode: newMode })
                            }
                        }} />

                    <IconButton onClick={handleDelete} style={{ "marginLeft": "auto" }}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            }
        </>
    )
}

export default ExpenseEntry

