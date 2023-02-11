import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

declare type MediaCarousel = {
  elementArr: any;
};

const MediaCarousel = (props: MediaCarousel) => {
  const { elementArr } = props;
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={3000}
      infinite={true}
      containerClass={"media-carousel"}
    >
      {elementArr?.map((i: any, idx: number) => {
        return (
          <div key={`carousel-item-${idx}`} className="wrapper">
            {i}
          </div>
        );
      })}
    </Carousel>
  );
};

export default MediaCarousel;
