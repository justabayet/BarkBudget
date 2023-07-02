import React from 'react'

import { Expectation, useExpectations } from 'Providers/GraphValuesProvider'

import EntryExpectation from './Entry/EntryExpectation/EntryExpectation'
import PanelTransaction from './PanelTransaction'


const PanelExpectations = () => {
    return <PanelTransaction<Expectation> useValues={useExpectations} ChildComponent={EntryExpectation} textEmpty={'Add expected earnings and expenses (e.g. salary, rent, trips)'} />
}


export default PanelExpectations