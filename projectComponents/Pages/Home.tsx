import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { labelConfig, serverConfig } from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";
import MediaCarousel from "../UI/MediaCarousel";

export type HomeProps = {
  allProducts: any;
  carousel: any;
};

const Home = (props: HomeProps) => {
  const { allProducts, carousel } = props;
  const redirect = useRouter();
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;

  const navigate = (path: string) => {
    redirect.push(path);
  };

  return (
    <>
      <div className="home-screen">
        <MediaCarousel
          elementArr={carousel?.map((i: any) => {
            return (
              <img
                src={`${url}${i?.mediaPath}`}
                className="product-image"
                alt={labelConfig?.image_not_loaded}
              />
            );
          })}
        />
        <div className="header">Our Products</div>
        {allProducts?.map((i: any) => {
          return (
            <div key={`catagory-${i?.cat}`} className="product-catagory">
              <div className="catagory-header">
                <div className="title">
                  {/* {labelConfig?.home_catagory_header_title} */}
                  {i?.cat}
                </div>
                {i?.prod?.length > 4 && (
                  <button
                    className="view-all"
                    onClick={() => {
                      navigate(`/catagory/${i?.catId}`);
                    }}
                  >
                    {labelConfig?.home_view_all_button}
                  </button>
                )}
              </div>
              <div className="catagory-body">
                {i?.prod
                  ?.filter((i: any, v: number) => {
                    return v <= 3;
                  })
                  ?.map((val: any, ind: any) => {
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
