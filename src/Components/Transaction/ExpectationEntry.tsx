import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, IconButton, Typography } from "@mui/material"
import React, { createRef, useEffect, useState } from "react"
import { modeNames } from "../../Modes/const"
import { useDeviceDetails } from "../../Providers/DeviceDetailsProvider"
import { Expectation } from "../../Providers/GraphValuesProvider/ExpectationsProvider"
import { GenericEntry } from "../../Providers/GraphValuesProvider/GenericValues"
import { compareDate, getFormattedDate } from "../../helpers"
import AmountField from "../Fields/AmountField"
import CustomDatePicker from "../Fields/CustomDatePicker"
import CustomTextField from '../Fields/CustomTextField'
import DeleteButton from './DeleteButton'
import DummyEntry from './DummyEntry'
import ModeSelector from "./ModeSelector"


const ExpectationEntry: GenericEntry<Expectation> = ({ value, handleDelete, handleSave }) => {
    const { isBodyFullSize } = useDeviceDetails()

    const [open, setOpen] = useState(!!value.new)
    const [highlighted, setHighlighted] = useState(false)

    const [valueCopy, setValueCopy] = useState<Expectation | null>(null)

    const elementRef = createRef<HTMLDivElement>()

    useEffect(() => {
        if (!!value.new || !!value.edited) {
            window.scrollTo({ behavior: "smooth", top: elementRef.current?.offsetTop })

            setHighlighted(true)

            if (isBodyFullSize) {
                value.new = false
                value.edited = false

                setTimeout(() => {
                    setHighlighted(false)
                }, 1000)
            }
        }
    }, [value.new, value.edited, value, elementRef, isBodyFullSize])

    const handleClickOpen = () => {
        setValueCopy(new Expectation(value))
        setOpen(true)
    }

    const handleClose = () => {
        if (!isBodyFullSize) {
            value.new = false
            value.edited = false

            setTimeout(() => {
                setHighlighted(false)
            }, 1000)
        }

        setOpen(false)
    }

    const handleCancel = () => {
        if (value.new) {
            handleClose()
            handleDelete()
        } else {
            handleClose()
            if (valueCopy) handleSave(valueCopy)
        }
    }

    const dummy = DummyEntry({ id: value.id })
    if (dummy) return dummy

    return (
        <>
            {!isBodyFullSize ?
                <>
                    <Card elevation={highlighted ? 5 : 3} ref={elementRef} sx={{ mt: 3, border: 1, borderColor: highlighted ? 'secondary.main' : 'transparent', transition: 'border-color 0.3s linear' }}>
                        <CardActionArea onClick={handleClickOpen}>
                            <CardContent sx={{ p: 1.5 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography>
                                            {value.name}
                                        </Typography>
                                        <Typography>
                                            {value.amount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Typography variant='caption'>
                                            {getFormattedDate(value.startDate)}
                                            {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? ` - ${getFormattedDate(value.endDate)}` : ''}
                                        </Typography>
                                        <Typography variant='caption'>
                                            {value.mode}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>

                    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth disableScrollLock>
                        <DialogContent>
                            <Box sx={{ pt: 3, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
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
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: "center", flexDirection: "column" }}>
                                <CustomTextField
                                    text={value.name}
                                    setText={(newName) => {
                                        if (newName !== value.name) {
                                            console.log("new name")
                                            handleSave({ ...value, name: newName })
                                        }
                                    }} />

                                <Box>
                                    <CustomDatePicker
                                        date={value.startDate}
                                        setDate={(newDate) => {
                                            if (!compareDate(newDate, value.startDate)) {
                                                handleSave({ ...value, startDate: newDate })
                                            }
                                        }} />

                                    {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) &&
                                        <CustomDatePicker
                                            date={value.endDate}
                                            setDate={(newDate) => {
                                                if (!compareDate(newDate, value.endDate)) {
                                                    handleSave({ ...value, endDate: newDate })
                                                }
                                            }} />
                                    }
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: "center", flexDirection: "column", marginLeft: "auto", width: 120 }}>

                                <AmountField
                                    amount={value.amount}
                                    setAmount={(newAmount) => {
                                        if (newAmount !== value.amount) {
                                            handleSave({ ...value, amount: newAmount })
                                        }
                                    }} />

                                <ModeSelector
                                    mode={value.mode}
                                    setMode={(newMode) => {
                                        if (newMode !== value.mode) {
                                            handleSave({ ...value, mode: newMode })
                                        }
                                    }} />
                            </Box>

                            <IconButton onClick={handleDelete} sx={{ ml: 2 }}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            }
        </>
    )
}

export default ExpectationEntry

