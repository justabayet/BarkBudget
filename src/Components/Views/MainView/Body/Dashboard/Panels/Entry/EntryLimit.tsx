import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Typography } from '@mui/material'

import { GenericEntryType, Limit } from 'Providers/GraphValuesProvider'
import { compareDate, getFormattedDate } from 'helpers'
import { AmountField, CustomDatePicker } from '../Fields'
import EntryGeneric from './EntryGeneric'

const LimitEntry: GenericEntryType<Limit> = ({ value, handleDelete, handleSave }) => {
    const DialogElements = [
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3} key='limit-dates'>
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
        </Box>,
        <AmountField
            key='limit-amount'
            label='Amount'
            amount={value.amount}
            setAmount={(newAmount) => {
                if (newAmount !== value.amount) {
                    handleSave({ ...value, amount: newAmount })
                }
            }} />
    ]

    const CardMobileElements = [
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key='limit-body'>
            <Typography>
                {getFormattedDate(value.startDate)} - {getFormattedDate(value.endDate)}
            </Typography>
            <Typography>
                {value.amount}
            </Typography>
        </Box>
    ]

    const CardDesktopElements = [
        <CustomDatePicker
            key='limit-start-date'
            date={value.startDate}
            setDate={(newDate) => {
                if (!compareDate(newDate, value.startDate)) {
                    handleSave({ ...value, startDate: newDate })
                }
            }} />,
        <CustomDatePicker
            key='limit-end-date'
            date={value.endDate}
            setDate={(newDate) => {
                if (!compareDate(newDate, value.endDate)) {
                    handleSave({ ...value, endDate: newDate })
                }
            }} />,
        <AmountField
            key='limit-amount'
            amount={value.amount}
            setAmount={(newAmount) => {
                if (newAmount !== value.amount) {
                    handleSave({ ...value, amount: newAmount })
                }
            }} />,
        <IconButton onClick={handleDelete} style={{ 'marginLeft': 'auto' }} key='limit-delete'>
            <DeleteIcon />
        </IconButton>
    ]


    return (
        <EntryGeneric<Limit>
            value={value}
            Value={Limit}
            handleDelete={handleDelete}
            handleSave={handleSave}
            DialogElements={DialogElements}
            CardMobileElements={CardMobileElements}
            CardDesktopElements={CardDesktopElements} />
    )
}

export default LimitEntry
