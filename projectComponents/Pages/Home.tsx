import { useRouter } from "next/router";
import React, { useState } from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import { paytmConfig } from "../../config/siteConfig";
import { uploadImage } from "../Functions/util";
import PaytmPayment from "../UI/PaytmPayment";

export type HomeProps = {
  allProducts: any;
};

const Home = (props: HomeProps) => {
  const { allProducts } = props;
  const redirect = useRouter();

  const catagorySet = Array.from(
    new Set(
      allProducts.map((i: any) => {
        return i?.catagory;
      })
    )
  );

  const navigate = (path: string) => {
    redirect.push(path);
  };

  // const uploadImageFunc = (e: any) => {
  //   const fileArr = Array.from(e.target.files);
  //   uploadImage(fileArr).then((res: any) => {
  //     console.log(res?.data);
  //   });
  // };

  return (
    <>
      <div className="home-screen">
        {/* <input
              type={"file"}
              multiple={true}
              accept={"image/*"}
              onChange={uploadImageFunc}
            /> */}
        {catagorySet?.map((i: any) => {
          return (
            <div key={`catagory-${i}`} className="product-catagory">
              <div className="catagory-header">
                <div className="title">Category {i}</div>
                {allProducts?.filter((v: any) => v?.catagory === i).length >
                  4 && <button className="view-all">View all</button>}
              </div>
              <div className="catagory-body">
                {allProducts
                  ?.filter((v: any) => v?.catagory === i)
                  .filter((w: any, ind: any) => ind <= 3)
                  .map((val: any, ind: any) => {
                    return (
                      <div
                        key={`product-card-${ind}`}
                        className="product-card"
                        onClick={() => {
                          navigate(`product/${val?._id}`);
                        }}
                      >
                        <div className="product-image-container">
                          <img
                            src={
                              "https://www.boffocakes.com/admin_area/product_images/Sweet%20pink%20and%20gold%20cake-1.jpg"
                            }
                            alt="Image"
                            className="product-image"
                          />
                        </div>
                        <div className="product-name">{val?.title}</div>
                        <div className="product-price">
                          &#8377;{val?.unitValue}
                        </div>
                        {/* <PaytmPayment
                          MID={paytmConfig?.mid}
                          MKEY={paytmConfig?.mkey}
                          Total={parseInt(val?.item_price)}
                        /> */}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
