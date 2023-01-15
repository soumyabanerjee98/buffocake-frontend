import Image from 'next/image'
import React from 'react'
import DummyCake from '../Assets/Images/dummy-photo.jpg'

const Home = () => {
  const modelData = [
    {
      catagory: 'A',
      item_name: 'Purple Ballerina Cake',
      item_price: '50',
    },
    {
      catagory: 'B',
      item_name: 'Pink Butterfly Cake',
      item_price: '150',
    },
    {
      catagory: 'C',
      item_name: 'Purple Ballerina Cake',
      item_price: '50',
    },
    {
      catagory: 'A',
      item_name: 'Pink Butterfly Cake',
      item_price: '150',
    },
    {
      catagory: 'A',
      item_name: 'Purple Ballerina Cake',
      item_price: '50',
    },
    {
      catagory: 'A',
      item_name: 'Pink Butterfly Cake',
      item_price: '150',
    },
    {
      catagory: 'A',
      item_name: 'Purple Ballerina Cake',
      item_price: '50',
    },
    {
      catagory: 'B',
      item_name: 'Pink Butterfly Cake',
      item_price: '150',
    },
  ]
  const catagorySet = Array.from(new Set(modelData.map(i => {return i?.catagory})))
  
  return (
    <>
      <div className='home-screen'>
        {catagorySet?.map((i) => {
          return (
          <div key={`catagory-${i}`} className='product-catagory'>
            <div className='catagory-header'>
              <div className='title'>
                Category {i}
              </div>
              {modelData?.filter((v) => v?.catagory === i).length > 4 &&
                <button
                  className='view-all'
                >
                  View all
                </button>
              }
            </div>
            <div className='catagory-body'>
              {modelData?.filter((v) => v?.catagory === i).filter((w, ind) => ind <= 3).map((val) => {
                return (
                  <div className='product-card'>
                    <Image src={DummyCake} alt='Image' className='product-image'/>
                    <div className='product-name'>
                      {val?.item_name}
                    </div>
                    <div className='product-price'>
                      &#8377;{val?.item_price}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          )
        })}
      </div>
    </>
  )
}

export default Home