import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { labelConfig, storageConfig } from '../../config/siteConfig'
import Logo from '../Assets/Images/boffocake-logo.png'
import SearchIcon from '../Assets/Images/search-icon.svg'
import { messageService } from '../Functions/messageService'
import { getSessionData } from '../Functions/util'
import CartIcon from './Icons/CartIcon'
import NameIcon from './Icons/NameIcon'
import ProfileIcon from './Icons/ProfileIcon'
import LoginCard from './LoginCard'

const Header = () => {
  const [searchTxt, setSearchTxt] = useState('')
  const [userLoggedIn, setUserLoggedIn] = useState(getSessionData(storageConfig?.userProfile) !== null ? true : false)
  const [loginCardOpen, setLoginCardOpen] = useState(false);
  const redirect = useRouter();
  const navigate = (url: string) => {
    redirect.push(url)
  }
  const searchByType = (e: any) => {
    let text = e.target.value
    setSearchTxt(text)
  }
  const openPopUp = () => {
    setLoginCardOpen(true)
  }
  useEffect(() => {
    messageService?.onReceive().subscribe((m: any) => {
      if(m?.sender === 'login-card' && m?.target === 'header'){
        if(m?.message?.action === 'close-popup'){
          setLoginCardOpen(false)
        }
      }
    })
  }, [])
  return (
    <header className='main-header'>
      <div className='left-col'>
        <Image src={Logo} alt='Boffocake Logo' className='logo-image' priority={true} onClick={() => navigate('/')}/>
        <div className='header-search'>
          <input
            type={'text'}
            value={searchTxt}
            onChange={searchByType}
            placeholder={labelConfig?.header_search_placeholder}
          />
          <div className='search-button'>
            <Image src={SearchIcon} alt='Search' />
          </div>
        </div>
      </div>
      <div className='right-col'>
        <CartIcon fill='rgb(107, 39, 51)' className='cart-image' textColor='rgb(107, 39, 51)'/>
        <div className='profile-container'>
          {userLoggedIn ?
            <NameIcon firstName='Soumya' lastName='Banerjee' className='name-icon'/>
          :
            <ProfileIcon fill='rgb(107, 39, 51)' className='profile-icon' textColor='rgb(107, 39, 51)' onClick={openPopUp}/>
          }
        </div>
      </div>
      {loginCardOpen && <LoginCard/>}
    </header>
  )
}

export default Header