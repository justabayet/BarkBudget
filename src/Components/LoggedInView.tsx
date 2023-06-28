import React from 'react'
import Body from './Body'
import './LoggedInView.css'
import MainHeader from './MainHeader'


const LoggedInView = (): JSX.Element => {
    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <MainHeader />
            <Body />
        </div>
    )
}

export default LoggedInView