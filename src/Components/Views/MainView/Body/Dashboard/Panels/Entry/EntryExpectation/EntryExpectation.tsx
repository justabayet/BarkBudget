import React from 'react'

import Delete from '@mui/icons-material/Delete'
import { Box, IconButton, Typography } from '@mui/material'

import { modeNames } from 'Modes/const'
import ModeSelector from './SelectorMode'

import { Expectation, GenericEntryType } from 'Providers/GraphValuesProvider'
import { compareDate, getFormattedDate, getOrdinal } from 'helpers'
import { AmountField, CustomDatePicker, CustomTextField } from '../../Fields'
import SwitchingField from '../../Fields/SwitchingField'
import EntryGeneric from '../EntryGeneric'


const EntryExpectation: GenericEntryType<Expectation> = ({ value, handleDelete, handleSave, isFirstInit }) => {
    const DialogElements = [
        <CustomTextField
            key='expectation-dialog-name'
            label={'Name'}
            value={value.name}
            setValue={(newName) => {
                if (newName !== value.name) {
                    console.log('new name')
                    handleSave({ ...value, name: newName })
                }
            }} />,

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3} key='expectation-dialog-dates'>
            <CustomDatePicker
                key='expectation-dialog-start-date'
                label={[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? 'Start Date' : 'Date'}
                value={value.startDate}
                setValue={(newDate) => {
                    if (!compareDate(newDate, value.startDate)) {
                        handleSave({ ...value, startDate: newDate })
                    }
                }} />

            {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) &&
                <CustomDatePicker
                    key='expectation-dialog-end-date'
                    label='End Date'
                    value={value.endDate}
                    setValue={(newDate) => {
                        if (!compareDate(newDate, value.endDate)) {
                            handleSave({ ...value, endDate: newDate })
                        }
                    }} />}
        </Box>,

        [modeNames.MONTHLY].includes(value.mode) ?
            <AmountField
                label='Trigger Day'
                value={value.updateDay!}
                setValue={(newUpdateDay) => {
                    if (newUpdateDay !== value.updateDay) {
                        handleSave({ ...value, updateDay: newUpdateDay })
                    }
                }}
                key='expectation-dialog-update-day' /> :
            <React.Fragment key='expectation-dialog-update-day'></React.Fragment>,

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }} gap={3} key='expectation-dialog-amount-mode'>
            <AmountField
                key='expectation-dialog-amount'
                label='Amount'
                value={value.amount}
                setValue={(newAmount) => {
                    if (newAmount !== value.amount) {
                        handleSave({ ...value, amount: newAmount })
                    }
                }} />

            <ModeSelector
                key='expectation-dialog-mode'
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
            <Typography key='expectation-card-mobile-name'>
                {value.name}
            </Typography>
            <Typography key='expectation-card-mobile-amount'>
                {value.amount}
            </Typography>
        </Box>,
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} key='expectation-card-mobile-date-mode'>
            <Typography variant='caption' key='expectation-card-mobile-date'>
                {getFormattedDate(value.startDate)}
                {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) ? ` - ${getFormattedDate(value.endDate)}` : ''}
                {[modeNames.MONTHLY].includes(value.mode) ? ` / every ${value.updateDay!}${getOrdinal(value.updateDay!)}` : ''}
            </Typography>
            <Typography variant='caption' key='expectation-card-mobile-mode'>
                {value.mode}
            </Typography>
        </Box>
    ]

    const CardDesktopElements = [
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'column' }} key='expectation-card-desktop-name-dates'>
            <CustomTextField
                value={value.name}
                setValue={(newName) => {
                    if (newName !== value.name) {
                        console.log('new name')
                        handleSave({ ...value, name: newName })
                    }
                }} />

            <Box>
                <CustomDatePicker
                    value={value.startDate}
                    setValue={(newDate) => {
                        if (!compareDate(newDate, value.startDate)) {
                            handleSave({ ...value, startDate: newDate })
                        }
                    }} />

                {[modeNames.DAILY, modeNames.MONTHLY].includes(value.mode) &&
                    <CustomDatePicker
                        value={value.endDate}
                        setValue={(newDate) => {
                            if (!compareDate(newDate, value.endDate)) {
                                handleSave({ ...value, endDate: newDate })
                            }
                        }} />
                }
            </Box>


            {[modeNames.MONTHLY].includes(value.mode) &&
                <SwitchingField<number>
                    prefix="Every "
                    suffix={getOrdinal(value.updateDay!)}
                    middleString={value.updateDay!.toString()}
                    key='expectation-trigger-day'

                    FieldComponent={AmountField}
                    value={value.updateDay!}
                    setValue={(newUpdateDay) => {
                        if (newUpdateDay !== value.updateDay) {
                            handleSave({ ...value, updateDay: newUpdateDay })
                        }
                    }} />
            }
        </Box>,

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginLeft: 'auto', width: 120 }} key='expectation-card-desktop-amount-mode'>
            <AmountField
                key='expectation-amount'
                value={value.amount}
                setValue={(newAmount) => {
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
            CardDesktopElements={CardDesktopElements}
            isFirstInit={isFirstInit} />
    )
}


export default EntryExpectation

