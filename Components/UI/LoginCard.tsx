import React, { useState } from 'react'
import { messageService } from '../Functions/messageService'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const LoginCard = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  })
    const closePopUp = () => {
        // @ts-ignore
        messageService?.sendMessage('login-card', {action: 'close-popup'}, 'header')
    }
    const clickOutSide = (e: any) => {
      if(e.target.className === 'modal'){
        closePopUp()
      }
    }
  return (
    <div className='modal' onClick={clickOutSide}>
        <div className='login-card'>
            <form>
              <div className='form-label'>
                Phone Number
              </div>
              <div className='form-input'>
                <PhoneInput
                defaultCountry={'IN'}
                addInternationalOption={false}
                autoComplete={'off'}
                limitMaxLength={true}
                maxLength={11}
                countries={['IN']}
                placeholder="Enter phone number"
                value={formData?.phoneNumber}
                onChange={(e: any) => {
                  setFormData((prev: any) => {
                    return {...prev, phoneNumber: e}
                  })
                }}
              />
              </div>
              <div className='form-label'>
                Password
              </div>
              <div className='form-input'>
                <input
                  type={'password'}
                  value={formData?.password}
                  placeholder='Password'
                  onChange={(e: any) => {
                  setFormData((prev: any) => {
                    return {...prev, password: e.target.value}
                  })
                }}
                />
              </div>
              <div className='form-input'>
                <button type='submit' className='login-button'>
                  Log in
                </button>
              </div>
              <div className='or'>Or</div>
            </form>
            <button type='button' className='google-button'>
                Sign in with <span style={{color: '#4285F4'}}>G</span>
                  <span style={{color: '#EA4335'}}>o</span>
                  <span style={{color: '#FBBC05'}}>o</span>
                  <span style={{color: '#4285F4'}}>g</span>
                  <span style={{color: '#34A853'}}>l</span>
                  <span style={{color: '#EA4335'}}>e</span>
            </button>
        </div>
    </div>
  )
}

export default LoginCard