import React from 'react'
import Footer from './Footer';
import Header from './Header';

const BasicLayout = (props: any) => {
    const { children } = props;
  return (
    <>
    <Header/>
    <div className='main-body'>
      {children}
    </div>
    <Footer/>
    </>
  )
}

export default BasicLayout