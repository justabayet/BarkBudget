import React from 'react'

import Body from './Body'
import Header from './Header'

import './MainView.css'


const MainView = (): JSX.Element => {
    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <Header />
            <Body />
        </div>
    )
}

export default MainView