import Head from "next/head";
import React from "react";
import { callApi } from "../../Components/Functions/util";
import PageNotFound from "../../Components/Pages/PageNotFound";
import BasicLayout from "../../Components/UI/BasicLayout";
import { processIDs } from "../../config/processID";

const Product = (props: any) => {
  const { productDetails } = props;
  return (
    <>
      {productDetails ? (
        <>
          <Head>
            <title>{productDetails?.metaTitle}</title>
            <meta name="description" content={productDetails?.metaDetails} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <BasicLayout>{productDetails?.id}</BasicLayout>
        </>
      ) : (
        <PageNotFound />
      )}
    </>
  );
};

export async function getServerSideProps({ params, res }: any) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
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
  };
}

export default Product;
