import Image from "next/image";
import React from "react";
import { labelConfig, serverConfig } from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";
import { metaUrlGenerate, openTab } from "../Functions/util";

export type CatagoryProps = {
  catagoryName: string;
  productList: any;
};
const Catagory = (props: CatagoryProps) => {
  const { productList, catagoryName } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  return (
    <div className="catagory-screen">
      <div className="header">{catagoryName}</div>
      <div className="catagory-list">
        {productList?.map((val: any, ind: number) => {
          return (
           <a href = {`/product/${metaUrlGenerate(val?.metaHead)}`}  target="_blank" style={{ textDecoration: 'none' }}> <div
              key={`product-card-${ind}`}
              className="product-card"
              onClick={() => {
                openTab(`/product/${metaUrlGenerate(val?.metaHead)}`);
              }}
            >
              <div className="product-image-container">
                {val?.productImage?.length > 0 ? (
                  <img
                    src={`${url}${val?.productImage?.[0]?.mediaPath}`}
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
              <div className="same-day-container">
                {val?.sameDay && (
                  <span className="same-day">Same day delivery</span>
                )}
              </div>
              <div className="product-name">{val?.title}</div>
              <div className="product-price">
                &#8377;
                {Math.min(
                  ...val?.weight?.map((i: any) => {
                    return i?.value;
                  })
                )}
              </div>
            </div></a>
          );
        })}
      </div>
    </div>
  );
};

export default Catagory;
