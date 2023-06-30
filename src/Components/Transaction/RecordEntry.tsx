import DeleteIcon from "@mui/icons-material/Delete"
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material"
import React, { createRef, useEffect, useState } from "react"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"
import { Record } from "../../Providers/GraphValuesProvider/RecordsProvider"
import { compareDate, getFormattedDate } from "../../helpers"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"
import DeleteButton from "./DeleteButton"
import DummyEntry from "./DummyEntry"


const RecordEntry: GenericEntry<Record> = ({ value, handleDelete, handleSave }) => {
    const { isBodyFullSize } = useDeviceDetails()

    const [open, setOpen] = useState(!!value.new)
    const [highlighted, setHighlighted] = useState(false)

    const [valueCopy, setValueCopy] = useState<Record | null>(null)

    const elementRef = createRef<HTMLDivElement>()

    useEffect(() => {
        if (!!value.new || !!value.edited) {
            window.scrollTo({ behavior: "smooth", top: elementRef.current?.offsetTop })

            setHighlighted(true)

            value.new = false
            value.edited = false

            setTimeout(() => {
                setHighlighted(false)
            }, 1000)
        }
    }, [value.new, value.edited, value, elementRef])

    const handleClickOpen = () => {
        setValueCopy(new Record(value))
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleCancel = () => {
        handleClose()
        if (valueCopy) handleSave(valueCopy)
    }

    const dummy = DummyEntry({ id: value.id })
    if (dummy) return dummy

    return (
        <>
            {!isBodyFullSize ?
                <>
                    <Card elevation={highlighted ? 5 : 3} ref={elementRef} sx={{ mt: 3, border: 1, borderColor: highlighted ? 'secondary.main' : 'transparent', transition: 'border-color 0.3s linear' }}>
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

                    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth disableScrollLock>
                        <DialogContent>
                            <Box sx={{ pt: 3, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
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
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <DeleteButton sx={{ m: 1, mr: 'auto' }} action={() => { handleClose(); handleDelete() }} />
                            <Button onClick={handleCancel} variant="outlined" autoFocus>Cancel</Button>
                            <Button onClick={handleClose} variant="contained" color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
                :
                <Card elevation={highlighted ? 5 : 3} ref={elementRef} sx={{ mt: 3, border: 1, borderColor: highlighted ? 'secondary.main' : 'transparent', transition: 'border-color 0.3s linear' }}>
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
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
                    </CardContent>
                </Card>
            }
        </>
    )
}

export default RecordEntry

