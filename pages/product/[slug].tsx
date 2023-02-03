import Head from "next/head";
import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { processIDs } from "../../config/processID";
import { callApi } from "../../projectComponents/Functions/util";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Products from "../../projectComponents/Pages/Products";

const ProductPage = (props: any) => {
  const { productDetails } = props;
  return (
    <Suspense fallback={<Skeleton count={5} />}>
      {productDetails ? (
        <>
          <Head>
            <title>{productDetails?.metaHead}</title>
            <link rel="icon" href="../boffocake-logo.png" />
            <meta name="description" content={productDetails?.metaDesc} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Products productDetails={productDetails} />
        </>
      ) : (
        <PageNotFound />
      )}
    </Suspense>
  );
};

export async function getStaticProps({ params }: any) {
  let data = await callApi(processIDs?.get_product_details, {
    productId: params.slug,
  }).then((res: any) => {
    if (res?.data?.returnCode) {
      return res?.data?.returnData;
    } else {
      return null;
    }
  });
  return {
    props: {
      productDetails: data,
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  let data = await callApi(processIDs?.get_all_products, {}).then(
    (res: any) => {
      if (res?.data?.returnCode) {
        return res?.data?.returnData;
      } else {
        return null;
      }
    }
  );
  const paths = data.map((i: any) => ({
    params: { slug: i._id },
  }));
  return { paths, fallback: true };
}

export default ProductPage;
