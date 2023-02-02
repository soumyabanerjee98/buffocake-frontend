"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import {
  labelConfig,
  paytmConfig,
  serverConfig,
} from "../../config/siteConfig";
import { uploadImage } from "../Functions/util";
import PaytmPayment from "../UI/PaytmPayment";
import NoIMage from "../Assets/Images/no-image.png";

export type HomeProps = {
  allProducts: any;
};

const Home = (props: HomeProps) => {
  const { allProducts } = props;
  const redirect = useRouter();
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
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
  //     console.log(res.json());
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
                <div className="title">
                  {labelConfig?.home_catagory_header_title} {i}
                </div>
                {allProducts?.filter((v: any) => v?.catagory === i).length >
                  4 && (
                  <button className="view-all">
                    {labelConfig?.home_view_all_button}
                  </button>
                )}
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
                          {val?.productImage ? (
                            <img
                              src={`${url}${val?.productImage}`}
                              alt={labelConfig?.image_not_loaded}
                              className="product-image"
                            />
                          ) : (
                            <Image
                              src={NoIMage}
                              alt={labelConfig?.image_not_loaded}
                              className="product-image"
                            />
                          )}
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
