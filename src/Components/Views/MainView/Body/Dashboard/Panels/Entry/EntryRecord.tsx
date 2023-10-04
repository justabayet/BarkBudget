import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Typography } from '@mui/material'

import { GenericEntryType, Record } from 'Providers/GraphValuesProvider'
import { compareDate, getFormattedDate } from 'helpers'
import { AmountField, CustomDatePicker } from '../Fields'
import EntryGeneric from './EntryGeneric'


const RecordEntry: GenericEntryType<Record> = ({ value, handleDelete, handleSave }) => {
    const DialogElements = [
        <CustomDatePicker
            key='record-date'
            label={'Date'}
            value={value.date}
            setValue={(newDate) => {
                if (!compareDate(newDate, value.date)) {
                    handleSave({ ...value, date: newDate })
                }
            }} />,
        <AmountField
            key='record-amount'
            label='Amount'
            value={value.amount}
            setValue={(newAmount) => {
                if (newAmount !== value.amount) {
                    handleSave({ ...value, amount: newAmount })
                }
            }} />
    ]

    const CardMobileElements = [
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key='record-card-body'>
            <Typography>
                {getFormattedDate(value.date)}
            </Typography>
            <Typography>
                {value.amount}
            </Typography>
        </Box>
    ]

    const CardDesktopElements = [
        <CustomDatePicker
            key='record-data'
            value={value.date}
            setValue={(newDate) => {
                if (!compareDate(newDate, value.date)) {
                    handleSave({ ...value, date: newDate })
                }
            }} />,
        <AmountField
            key='record-amount'
            value={value.amount}
            setValue={(newAmount) => {
                if (newAmount !== value.amount) {
                    handleSave({ ...value, amount: newAmount })
                }
            }} />,

        <IconButton onClick={handleDelete} style={{ 'marginLeft': 'auto' }} key='delete-button'>
            <DeleteIcon />
        </IconButton>
    ]


    return (
        <EntryGeneric<Record>
            value={value}
            Value={Record}
            handleDelete={handleDelete}
            handleSave={handleSave}
            DialogElements={DialogElements}
            CardMobileElements={CardMobileElements}
            CardDesktopElements={CardDesktopElements} />
    )

}


export default RecordEntry
