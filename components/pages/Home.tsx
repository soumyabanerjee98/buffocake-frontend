import React from 'react'
import { uploadMedia } from '../Functions/util';
import BasicLayout from '../UI/BasicLayout'

const Home = () => {
  const uploadfiles = (e: any) => {
    let tempFiles = e.target.files;
    let fileArr = Array.from(tempFiles)
    uploadMedia(fileArr); 
  }
  return (
    <>
      <BasicLayout>
        <div className='home-screen'>Home</div>
        <input type="file" multiple={true} onChange={uploadfiles}/>
      </BasicLayout>
    </>
  )
}

export default Home