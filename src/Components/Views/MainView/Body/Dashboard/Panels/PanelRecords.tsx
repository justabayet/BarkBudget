import React from 'react'

import { Record, useRecords } from 'Providers/GraphValuesProvider'

import EntryRecord from './Entry/EntryRecord'
import PanelTransaction from './PanelTransaction'


const PanelRecords = () => {
    return <PanelTransaction<Record> useValues={useRecords} ChildComponent={EntryRecord} textEmpty={'Record your current funds to track your budget\'s progress'} />
}


export default PanelRecords