import React from "react";
import ProductPageLoading from "./loading";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <React.Suspense fallback={<ProductPageLoading />}>
        {children}
      </React.Suspense>
    </>
  );
};

export default HomePageLayout;
