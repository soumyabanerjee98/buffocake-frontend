import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { processIDs } from "../../config/processID";
import { storageConfig } from "../../config/siteConfig";
import {
  callApi,
  getSessionObjectData,
} from "../../projectComponents/Functions/util";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Products from "../../projectComponents/Pages/Products";

const ProductPage = (props: any) => {
  const { productDetails, wishData } = props;
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
            <link rel="icon" href="../boffocake-logo.png" />
            <meta name="description" content={productDetails?.metaDesc} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Products productDetails={productDetails} wishData={wishData} />
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
  const wishData = async () => {
    let returndata;
    if (getSessionObjectData(storageConfig?.userProfile)) {
      returndata = await callApi(processIDs?.get_wishlist, {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      }).then((res: any) => {
        if (res?.data?.returnCode) {
          let returnStatement;
          if (res?.data?.returnData) {
            returnStatement = res?.data?.returnData?.includes(params.slug);
          } else {
            returnStatement = false;
          }
          return returnStatement;
        } else {
          return false;
        }
      });
    } else {
      returndata = false;
    }
    return returndata;
  };
  return {
    props: {
      productDetails: data,
      wishData: wishData(),
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
