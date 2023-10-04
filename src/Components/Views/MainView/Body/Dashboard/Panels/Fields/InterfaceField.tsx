

export interface FieldProps<valueType> {
    value: valueType
    setValue: (newValue: valueType) => void
    label?: string
}

export type FieldComponent<valueType> = (props: FieldProps<valueType>) => JSX.Element 