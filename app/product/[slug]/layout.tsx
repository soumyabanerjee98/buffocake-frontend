import React from "react";
import ProductPageLoading from "./loading";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <React.Suspense fallback={<ProductPageLoading />}>
        {children}
      </React.Suspense>
    </main>
  );
};

export default HomePageLayout;
