import React, { PropsWithChildren, createRef, useEffect, useState } from 'react'

import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent } from '@mui/material'

import { useDeviceDetails } from 'Providers'
import { EntryProps, TransactionType } from 'Providers/GraphValuesProvider'

import ButtonDelete from './ButtonDelete'
import DummyEntry from './EntryDummy'


interface EntryGenericProps<Transaction extends TransactionType> extends EntryProps<Transaction> {
    CardDesktopElements: JSX.Element[]
    CardMobileElements: JSX.Element[]
    DialogElements: JSX.Element[]
    Value: { new(transaction: Transaction): Transaction }
}

const EntryGeneric = <Transaction extends TransactionType>({ value, handleDelete, handleSave, CardDesktopElements, CardMobileElements, DialogElements, Value }: EntryGenericProps<Transaction>): JSX.Element => {
    const { isBodyFullSize } = useDeviceDetails()

    const [open, setOpen] = useState(!!value.new)
    const [highlighted, setHighlighted] = useState(false)

    const [valueCopy, setValueCopy] = useState<Transaction | null>(null)

    const elementRef = createRef<HTMLDivElement>()

    useEffect(() => {
        if (!!value.new || !!value.edited) {
            window.scrollTo({ behavior: 'smooth', top: elementRef.current?.offsetTop })

            setHighlighted(true)

            if (isBodyFullSize || !open) {
                value.new = false
                value.edited = false

                setTimeout(() => {
                    setHighlighted(false)
                }, 1000)
            }
        }
    }, [value.new, value.edited, value, elementRef, isBodyFullSize, open])

    const handleClickOpen = () => {
        setValueCopy(new Value(value))
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

    const CardEntry = ({ children }: PropsWithChildren) => (
        <Card elevation={3} ref={elementRef} sx={{ mt: 3, border: 1, borderColor: highlighted ? 'secondary.main' : 'transparent', transition: 'border-color 0.3s linear' }}>
            {children}
        </Card>
    )

    if (isBodyFullSize) {
        return (
            <CardEntry>
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {CardDesktopElements.map(el => el)}
                    </Box>
                </CardContent>
            </CardEntry>
        )
    } else {
        return (
            <Card elevation={3} ref={elementRef} sx={{ mt: 3, border: 1, borderColor: highlighted ? 'secondary.main' : 'transparent', transition: 'border-color 0.3s linear' }}>
                <CardActionArea onClick={handleClickOpen}>
                    <CardContent sx={{ p: 2 }}>
                        <Box>
                            {CardMobileElements.map(el => el)}
                        </Box>
                    </CardContent>
                </CardActionArea>

                <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth disableScrollLock>
                    <DialogContent>
                        <Box sx={{ pt: 3, flexWrap: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} gap={3}>
                            {DialogElements.map(el => el)}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <ButtonDelete sx={{ m: 1, mr: 'auto' }} onClick={() => { handleClose(); handleDelete() }} />
                        <Button onClick={handleCancel} variant='outlined' autoFocus>Cancel</Button>
                        <Button onClick={handleClose} variant='contained' color='primary'>Confirm</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        )
    }
}


export default EntryGeneric
