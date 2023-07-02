import React from 'react'

import { Delete } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { modeNames } from 'Modes/const'
import CustomTextField from '../../Fields/CustomTextField'
import ModeSelector from './SelectorMode'

import { Expectation, GenericEntryType } from 'Providers/GraphValuesProvider'
import { compareDate, getFormattedDate } from 'helpers'
import { AmountField, CustomDatePicker } from '../../Fields'
import EntryGeneric from '../EntryGeneric'


const EntryExpectation: GenericEntryType<Expectation> = ({ value, handleDelete, handleSave }) => {
    const DialogElements = [
        <CustomTextField
            key='expectation-dialog-name'
            label={'Name'}
            text={value.name}
            setText={(newName) => {
                if (newName !== value.name) {
                    console.log('new name')
                    handleSave({ ...value, name: newName })
                }
            }} />,

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3} key='expectation-dialog-dates'>
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
        </Box>,
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3} key='expectation-dialog-amount-mode'>
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
    ]

    const CardMobileElements = [
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key='expectation-card-mobile-name-amount'>
            <Typography>
                {value.name}
            </Typography>
            <Typography>
                {value.amount}
            </Typography>
        </Box>,
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key='expectation-card-mobile-date-mode'>
            <Typography variant='caption'>
                {getFormattedDate(value.startDate)}
                {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? ` - ${getFormattedDate(value.endDate)}` : ''}
            </Typography>
            <Typography variant='caption'>
                {value.mode}
            </Typography>
        </Box>
    ]

    const CardDesktopElements = [
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }} key='expectation-card-desktop-name-dates'>
            <CustomTextField
                text={value.name}
                setText={(newName) => {
                    if (newName !== value.name) {
                        console.log('new name')
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
        </Box>,

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column', marginLeft: 'auto', width: 120 }} key='expectation-card-desktop-amount-mode'>
            <AmountField
                key='expectation-amount'
                amount={value.amount}
                setAmount={(newAmount) => {
                    if (newAmount !== value.amount) {
                        handleSave({ ...value, amount: newAmount })
                    }
                }} />

            <ModeSelector
                key='expectation-mode'
                mode={value.mode}
                setMode={(newMode) => {
                    if (newMode !== value.mode) {
                        handleSave({ ...value, mode: newMode })
                    }
                }} />
        </Box>,

        <IconButton onClick={handleDelete} sx={{ ml: 2 }} key='expectation-delete'>
            <Delete />
        </IconButton>
    ]


    return (
        <EntryGeneric<Expectation>
            value={value}
            Value={Expectation}
            handleDelete={handleDelete}
            handleSave={handleSave}
            DialogElements={DialogElements}
            CardMobileElements={CardMobileElements}
            CardDesktopElements={CardDesktopElements} />
    )
}


export default EntryExpectation

