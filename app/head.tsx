import React from "react";
import { metaConfig } from "../config/siteConfig";

const HomePageHead = () => {
  return (
    <>
      <title>{metaConfig?.home_title}</title>
      <link rel="icon" href="./boffocake-logo.png" />
      <meta name="description" content={metaConfig?.home_desc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export default HomePageHead;
