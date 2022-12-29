import React, { useState } from 'react'
import Footer from './Footer';
import Header from './Header';

const BasicLayout = (props: any) => {
    const { children } = props;
    const [showLayout, setShowLayout] = useState(true);
  return (
    <>
    {showLayout && <Header/>}
    {children}
    {showLayout && <Footer/>}
    </>
  )
}

export default BasicLayout