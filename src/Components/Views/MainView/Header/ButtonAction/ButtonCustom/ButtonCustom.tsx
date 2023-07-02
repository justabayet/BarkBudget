import React from 'react'

import { Box } from '@mui/material'

import { GoogleIcon } from 'Components/Shared'
import { useAuthentication } from 'Providers'

import ButtonBody from './ButtonBody'
import CustomAvatar from './CustomAvatar'


interface ButtonCustomProps {
    openMenu: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void)
}

const ButtonCustom = ({ openMenu }: ButtonCustomProps): JSX.Element => {
    const { user, handleSignIn } = useAuthentication()

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            {user ?
                <ButtonBody
                    title="Account Menu"
                    Icon={<CustomAvatar name={user!.displayName!} />}
                    action={openMenu} />
                :
                <ButtonBody
                    title="Log in"
                    Icon={<GoogleIcon sx={{ width: 45, height: 45 }} />}
                    action={handleSignIn} />
            }
        </Box>
    )
}


export default ButtonCustom