import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material"
import React from "react"
import { useDeviceDetails } from '../../Providers/DeviceDetailsProvider'
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"
import { Limit } from "../../Providers/GraphValuesProvider/LimitsProvider"
import { compareDate, getFormattedDate } from "../../helpers"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"
import DeleteButton from './DeleteButton'

const LimitEntry: GenericEntry<Limit> = ({ value, handleDelete, handleSave }) => {
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
            {!isBodyFullSize ?
                <>
                    <Card elevation={3} sx={{ mt: 3 }}>
                        <CardActionArea onClick={handleClickOpen}>
                            <CardContent sx={{ p: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography>
                                            {getFormattedDate(value.startDate)} - {getFormattedDate(value.endDate)}
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
                        <DialogContent>
                            <Box sx={{ pt: 3, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3}>
                                    <CustomDatePicker
                                        label={'Start Date'}
                                        date={value.startDate}
                                        setDate={(newDate) => {
                                            if (!compareDate(newDate, value.startDate)) {
                                                handleSave({ ...value, startDate: newDate })
                                            }
                                        }} />

                                    <CustomDatePicker
                                        label='End Date'
                                        date={value.endDate}
                                        setDate={(newDate) => {
                                            if (!compareDate(newDate, value.endDate)) {
                                                handleSave({ ...value, endDate: newDate })
                                            }
                                        }} />
                                </Box>

                                <AmountField
                                    label='Amount'
                                    amount={value.amount}
                                    setAmount={(newAmount) => {
                                        if (newAmount !== value.amount) {
                                            handleSave({ ...value, amount: newAmount })
                                        }
                                    }} />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <DeleteButton sx={{ m: 1, mr: 'auto' }} action={() => { handleClose(); handleDelete() }} />
                            <Button onClick={handleClose} variant="outlined" autoFocus>Cancel</Button>
                            <Button onClick={handleClose} variant="contained" color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>

                :
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", mb: 3 }}>
                    <CustomDatePicker
                        date={value.startDate}
                        setDate={(newDate) => {
                            if (!compareDate(newDate, value.startDate)) {
                                handleSave({ ...value, startDate: newDate })
                            }
                        }} />

                    <CustomDatePicker
                        date={value.endDate}
                        setDate={(newDate) => {
                            if (!compareDate(newDate, value.endDate)) {
                                handleSave({ ...value, endDate: newDate })
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
                </Box>}
        </>
    )
}

export default LimitEntry

