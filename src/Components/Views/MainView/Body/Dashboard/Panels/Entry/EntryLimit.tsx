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
                value={value.startDate}
                setValue={(newDate) => {
                    if (!compareDate(newDate, value.startDate)) {
                        handleSave({ ...value, startDate: newDate })
                    }
                }} />

            <CustomDatePicker
                label='End Date'
                value={value.endDate}
                setValue={(newDate) => {
                    if (!compareDate(newDate, value.endDate)) {
                        handleSave({ ...value, endDate: newDate })
                    }
                }} />
        </Box>,
        <AmountField
            key='limit-amount'
            label='Amount'
            value={value.amount}
            setValue={(newAmount) => {
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
            value={value.startDate}
            setValue={(newDate) => {
                if (!compareDate(newDate, value.startDate)) {
                    handleSave({ ...value, startDate: newDate })
                }
            }} />,
        <CustomDatePicker
            key='limit-end-date'
            value={value.endDate}
            setValue={(newDate) => {
                if (!compareDate(newDate, value.endDate)) {
                    handleSave({ ...value, endDate: newDate })
                }
            }} />,
        <AmountField
            key='limit-amount'
            value={value.amount}
            setValue={(newAmount) => {
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
