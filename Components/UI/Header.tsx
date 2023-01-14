import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { labelConfig, storageConfig } from '../../Config/siteConfig'
import Logo from '../Assets/Images/boffocake-logo.png'
import SearchIcon from '../Assets/Images/search-icon.svg'
import Cart from '../Assets/Images/cart-icon.svg'
import { getSessionData } from '../Functions/util'

const Header = () => {
  const [searchTxt, setSearchTxt] = useState('')
  const [userLoggedIn, setUserLoggedIn] = useState(getSessionData(storageConfig?.userProfile) !== null ? true : false)
  const redirect = useRouter();
  const navigate = (url: string) => {
    redirect.push(url)
  }
  const searchByType = (e: any) => {
    let text = e.target.value
    setSearchTxt(text)
  }

  return (
    <header className='main-header'>
      <div className='left-col'>
        <Image src={Logo} alt='Boffocake Logo' className='logo-image' onClick={() => navigate('/')}/>
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
        <div className='cart-image-container'>
          <Image src={Cart} alt='Cart' className='cart-image'/>
        </div>
        <div className='signin-container'>
          {/* sign up / log in UI */}
        </div>
      </div>
    </header>
  )
}

export default Header