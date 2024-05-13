import React from 'react'

import ButtonCustom from './ButtonCustom'
import MenuCustom from './MenuCustom'


const ButtonAction = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleCloseMenu = () => setAnchorEl(null)

    return (
        <>
            <ButtonCustom openMenu={handleOpenMenu} />
            <MenuCustom anchorEl={anchorEl} handleCloseMenu={handleCloseMenu} />
        </>
    )
}

export default ButtonAction