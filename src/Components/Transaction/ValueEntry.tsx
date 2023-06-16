import DeleteIcon from "@mui/icons-material/Delete"
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import React from "react"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"
import { Value } from "../../Providers/GraphValuesProvider/ValuesProvider"
import { compareDate, getFormattedDate } from "../../helpers"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"


const ValueEntry: GenericEntry<Value> = ({ value, handleDelete, handleSave }) => {

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
                    <Card elevation={3} sx={{ mt: 3 }}>
                        <CardActionArea onClick={handleClickOpen}>
                            <CardContent>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography>
                                            {getFormattedDate(value.date)}
                                        </Typography>
                                        <Typography>
                                            {value.amount}
                                        </Typography>
                                    </Box>
                                </Box>

                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                        <DialogTitle>Edit</DialogTitle>
                        <DialogContent>
                            <Box sx={{ pt: 1, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
                                <CustomDatePicker
                                    label={'Date'}
                                    date={value.date}
                                    setDate={(newDate) => {
                                        if (!compareDate(newDate, value.date)) {
                                            handleSave({ ...value, date: newDate })
                                        }
                                    }} />
                                <AmountField
                                    label='Amount'
                                    amount={value.amount}
                                    setAmount={(newAmount) => {
                                        if (newAmount !== value.amount) {
                                            handleSave({ ...value, amount: newAmount })
                                        }
                                    }} />

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
                        date={value.date}
                        setDate={(newDate) => {
                            if (!compareDate(newDate, value.date)) {
                                handleSave({ ...value, date: newDate })
                            }
                        }} />

                    <AmountField
                        amount={value.amount}
                        setAmount={(newAmount) => {
                            if (newAmount !== value.amount) {
                                handleSave({ ...value, amount: newAmount })
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

export default ValueEntry

