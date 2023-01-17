import React from 'react'
import { messageService } from '../Functions/messageService'

const LoginCard = () => {
    const closePopUp = () => {
        // @ts-ignore
        messageService?.sendMessage('login-card', {action: 'close-popup'}, 'header')
    }
  return (
    <div className='modal'>
        <div className='login-card'>
            LoginCard
        </div>
    </div>
  )
}

export default LoginCard