import React from 'react'

import { Limit, useLimits } from 'Providers/GraphValuesProvider'

import EntryLimit from './Entry/EntryLimit'
import PanelTransaction from './PanelTransaction'


const PanelLimits = () => {
    return <PanelTransaction<Limit> useValues={useLimits} ChildComponent={EntryLimit} textEmpty={'Set limits to check that you won\'t go below it'} />
}


export default PanelLimits