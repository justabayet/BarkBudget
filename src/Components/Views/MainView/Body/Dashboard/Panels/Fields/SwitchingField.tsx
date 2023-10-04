import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { FieldComponent, FieldProps } from './InterfaceField'


interface SwitchingFieldProps<FieldType> extends FieldProps<FieldType> {
    prefix: string
    suffix: string
    middleString: string
    FieldComponent: FieldComponent<FieldType>
}

const SwitchingField = <FieldTypeDefined,>({ prefix, suffix, middleString, FieldComponent, value, setValue, label }: SwitchingFieldProps<FieldTypeDefined>): JSX.Element => {

    const [isEditing, setIsEditing] = useState<boolean>(false)

    return (
        <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center', flexDirection: 'row', cursor: 'pointer' }}>
            {isEditing ?
                <FieldComponent
                    value={value}
                    setValue={(newValue) => {
                        setIsEditing(false)
                        setValue(newValue)
                    }}
                    label={label} />
                :
                <Typography ml={1} p={1} onClick={() => setIsEditing(true)}>
                    {prefix}{middleString}{suffix}
                </Typography>}
        </Box>
    )
}


export default SwitchingField

