import React from 'react'
import Footer from './Footer';
import Header from './Header';

const BasicLayout = (props: any) => {
    const { children } = props;
  return (
    <>
    <Header/>
    {children}
    <Footer/>
    </>
  )
}

export default BasicLayout