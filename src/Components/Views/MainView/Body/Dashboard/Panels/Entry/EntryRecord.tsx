import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { Box, Checkbox, IconButton, Typography } from '@mui/material'

import { GenericEntryType, Record } from 'Providers/GraphValuesProvider'
import { compareDate, getFormattedDate } from 'helpers'
import { AmountField, CustomDatePicker } from '../Fields'
import EntryGeneric from './EntryGeneric'


const RecordEntry: GenericEntryType<Record> = ({ value, handleDelete, handleSave, isFirstInit }) => {
    const DialogElements = [
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} key='record-date-section'>
            <CustomDatePicker
                key='record-date'
                label={'Date'}
                value={value.date}
                setValue={(newDate) => {
                    if (!compareDate(newDate, value.date)) {
                        handleSave({ ...value, date: newDate })
                    }
                }} />

            <Checkbox
                icon={<PushPinOutlinedIcon />}
                checkedIcon={<PushPinIcon />}
                checked={value.isPinned}
                onChange={(event) => {
                    const newIsPinned = event.target.checked
                    handleSave({ ...value, isPinned: newIsPinned })
                }}
                color="default"
                key='record-pin-button' />
        </Box>,

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
            {value.isPinned && <PushPinIcon fontSize='small' style={{
                position: 'absolute',
                top: '4px',
                right: '3px',
                color: 'rgba(0, 0, 0, 0.84)'
            }} />}
            <Typography style={{ marginRight: '10px' }}>
                {value.amount}
            </Typography>
        </Box>
    ]

    const CardDesktopElements = [
        <CustomDatePicker
            key='record-date'
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

        <Box key='records-buttons'>
            <Checkbox
                icon={<PushPinOutlinedIcon />}
                checkedIcon={<PushPinIcon />}
                checked={value.isPinned}
                onChange={(event) => {
                    const newIsPinned = event.target.checked
                    handleSave({ ...value, isPinned: newIsPinned })
                }}
                color="default"
                style={{ 'marginLeft': 'auto' }}
                key='pin-button' />

            <IconButton onClick={handleDelete} style={{ 'marginLeft': 'auto' }} key='delete-button'>
                <DeleteIcon />
            </IconButton>
        </Box>
    ]


    return (
        <EntryGeneric<Record>
            value={value}
            Value={Record}
            handleDelete={handleDelete}
            handleSave={handleSave}
            DialogElements={DialogElements}
            CardMobileElements={CardMobileElements}
            CardDesktopElements={CardDesktopElements}
            isFirstInit={isFirstInit} />
    )

}


export default RecordEntry
