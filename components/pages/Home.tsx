import { useRouter } from "next/router";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { paytmConfig } from "../../config/siteConfig";
import { uploadImage } from "../Functions/util";
import PaytmPayment from "../UI/PaytmPayment";

const Home = () => {
  const redirect = useRouter();
  const [loader, setLoader] = useState(false);
  const modelData = [
    {
      id: 1,
      catagory: "A",
      item_name: "Purple Ballerina Cake",
      item_price: "50",
    },
    {
      id: 2,
      catagory: "B",
      item_name: "Pink Butterfly Cake",
      item_price: "150",
    },
    {
      id: 3,
      catagory: "C",
      item_name: "Purple Ballerina Cake",
      item_price: "50",
    },
    {
      id: 4,
      catagory: "A",
      item_name: "Pink Butterfly Cake",
      item_price: "150",
    },
    {
      id: 5,
      catagory: "A",
      item_name: "Purple Ballerina Cake",
      item_price: "50",
    },
    {
      id: 6,
      catagory: "A",
      item_name: "Pink Butterfly Cake",
      item_price: "150",
    },
    {
      id: 7,
      catagory: "A",
      item_name: "Purple Ballerina Cake",
      item_price: "50",
    },
    {
      id: 8,
      catagory: "B",
      item_name: "Pink Butterfly Cake",
      item_price: "150",
    },
  ];

  const catagorySet = Array.from(
    new Set(
      modelData.map((i) => {
        return i?.catagory;
      })
    )
  );

  const navigate = (path: string) => {
    setLoader(true);
    window.scrollTo(0, 0);
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
        {loader ? (
          <Skeleton count={5} />
        ) : (
          <>
            {/* <input
              type={"file"}
              multiple={true}
              accept={"image/*"}
              onChange={uploadImageFunc}
            /> */}
            {catagorySet?.map((i) => {
              return (
                <div key={`catagory-${i}`} className="product-catagory">
                  <div className="catagory-header">
                    <div className="title">Category {i}</div>
                    {modelData?.filter((v) => v?.catagory === i).length > 4 && (
                      <button className="view-all">View all</button>
                    )}
                  </div>
                  <div className="catagory-body">
                    {modelData
                      ?.filter((v) => v?.catagory === i)
                      .filter((w, ind) => ind <= 3)
                      .map((val, ind) => {
                        return (
                          <div
                            key={`product-card-${ind}`}
                            className="product-card"
                            onClick={() => {
                              navigate(`product/${val?.id}`);
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
                            <div className="product-name">{val?.item_name}</div>
                            <div className="product-price">
                              &#8377;{val?.item_price}
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
          </>
        )}
      </div>
    </>
  );
};

export default Home;
