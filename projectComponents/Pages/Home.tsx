import React from "react";
import { labelConfig, serverConfig } from "../../config/siteConfig";
import MediaCarousel from "../UI/MediaCarousel";
import FlavourScroll from "../UI/FlavourScroll";
import NavCard from "../UI/NavCard";
import GridSection from "../UI/GridSection";
export type HomeProps = {
  allProducts: any;
  carousel: any;
};

const Home = (props: HomeProps) => {
  const { allProducts, carousel } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="home-screen">
        <NavCard />
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
        <FlavourScroll />
        {/* copy start */}
        <div className="home-grid-view">
          <GridSection
            name={"Cakes"}
            sections={{
              sectionName1: "Designer Cakes",
              sectionName2: "Theme Cakes",
              sectionName3: "Birthday Cakes",
              sectionName4: "Anniversary Cakes",
              sectionName5: "Wedding Cakes",
              sectionName6: "Engagement Cakes",
              sectionPhoto1: "designercake.jpeg",
              sectionPhoto2: "themecake.jpeg",
              sectionPhoto3: "birthdayCake.jpeg",
              sectionPhoto4: "anniversaryCake.png",
              sectionPhoto5: "weddingcake.jpeg",
              sectionPhoto6: "engagementCake.png",
            }}
          />
          <GridSection
            name={"For Someone Special"}
            sections={{
              sectionName1: "Cakes For Him",
              sectionName2: "Cakes For Her",
              sectionName3: "Cakes For Mom",
              sectionName4: "Cakes For Dad",
              sectionName5: "Cakes For Boyfriend",
              sectionName6: "Cakes For Girlfriend",
              sectionPhoto1: "cakesHim.jpeg",
              sectionPhoto2: "cakesHer.jpeg",
              sectionPhoto3: "cakesMom.jpeg",
              sectionPhoto4: "cakesDad.png",
              sectionPhoto5: "cakesBoyFriend.jpeg",
              sectionPhoto6: "cakesGirlFriend.jpeg",
            }}
          />
        </div>
        {/* copy end */}
        <div className="scroll-to-top" onClick={scrolltoTop}>
          <i className="fa-solid fa-arrow-up scroll-arrow" />
        </div>
        <div
          className="taggbox"
          style={{ width: "100%", height: "100%" }}
          data-widget-id="134798"
          data-tags="false"
        ></div>
      </div>
    </>
  );
};

export default Home;
