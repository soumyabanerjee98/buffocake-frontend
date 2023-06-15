import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { labelConfig, serverConfig } from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";
import MediaCarousel from "../UI/MediaCarousel";
import { loadURL, metaUrlGenerate, openTab } from "../Functions/util";
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
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
    <head><div className="taggbox" style={{width:100}} data-widget-id="134786" data-tags="false" ></div><script src="https://widget.taggbox.com/embed-lite.min.js" type="text/javascript"></script></head>
      <div className="home-screen">
        <MediaCarousel
          elementArr={carousel?.map((i: any) => {
            if (i?.link) {
              return (
                <a href={i?.link} target="_blank" style={{ cursor: "pointer" }}>
                  <img
                    src={`${url}${i?.mediaPath}`}
                    className="carousel-image"
                    alt={labelConfig?.image_not_loaded}
                  />
                </a>
              );
            } else {
              return (
                <img
                  src={`${url}${i?.mediaPath}`}
                  className="carousel-image"
                  alt={labelConfig?.image_not_loaded}
                />
              );
            }
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
                  <a href = {`/catagory/${i?.catId}`}  target="_blank" style={{ textDecoration: 'none' }}> <button
                    className="view-all"
                    onClick={() => {
                      if (i?.type === "catagory") {
                        navigate(`/catagory/${i?.catId}`);
                      } else {
                        navigate(`/subcatagory/${i?.catId}`);
                      }
                    }}
                  >
                    {labelConfig?.home_view_all_button}
                  </button></a>
                )}
              </div>
              <div className="catagory-body">
                {i?.prod
                  ?.filter((i: any, v: number) => {
                    return v <= 3;
                  })
                  ?.map((val: any, ind: any) => {
                    return (
		    <a href = {`/product/${metaUrlGenerate(val?.metaHead)}`}  target="_blank" style={{ textDecoration: 'none' }}>
                      <div
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
        })}
        <div className="scroll-to-top" onClick={scrolltoTop}>
          <i className="fa-solid fa-arrow-up scroll-arrow" />
        </div>
        <div className="taggbox" style={{ width: '100%', height: '100%' }} data-widget-id="134786" data-tags="false"></div>
      </div>
    </>
  );
};

export default Home;
