import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { callApi } from "../../Components/Functions/util";
import PageNotFound from "../../Components/Pages/PageNotFound";
import BasicLayout from "../../Components/UI/BasicLayout";
import { processIDs } from "../../config/processID";

const Product = (props: any) => {
  const { productDetails } = props;
  const router = useRouter();
  if (router.isFallback) {
    return <Skeleton count={5} />;
  }
  return (
    <>
      {productDetails ? (
        <>
          <Head>
            <title>{productDetails?.metaHead}</title>
            <meta name="description" content={productDetails?.metaDesc} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <BasicLayout>
            <div>{productDetails?.title}</div>
            <div>{productDetails?.description}</div>
            <div>{productDetails?.unitValue}</div>
          </BasicLayout>
        </>
      ) : (
        <PageNotFound />
      )}
    </>
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

export default Product;
