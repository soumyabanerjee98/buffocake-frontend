import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { labelConfig, serverConfig } from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";

export type CatagoryProps = {
  productList: any;
};
const Catagory = (props: CatagoryProps) => {
  const { productList } = props;
  const redirect = useRouter();
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const navigate = (path: string) => {
    redirect.push(path);
  };
  return (
    <div className="catagory-screen">
      {productList?.map((val: any, ind: number) => {
        return (
          <div
            key={`product-card-${ind}`}
            className="product-card"
            onClick={() => {
              navigate(`/product/${val?._id}`);
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
            <div className="product-price">&#8377;{val?.unitValue}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Catagory;
