import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import { callApi } from "../../../projectComponents/Functions/util";
import PageNotFound from "../../../projectComponents/Pages/PageNotFound";
import Products from "../../../projectComponents/Pages/Products";

const ProductPage = (props: any) => {
  const { productDetails } = props;
  const router = useRouter();
  if (router.isFallback || productDetails === undefined) {
    return <>Loading...</>;
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
          <Products productDetails={productDetails} />
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
  }) // @ts-ignore
    .then((res: responseType) => {
      if (res?.status === 200) {
        if (res?.data?.returnCode) {
          return res?.data?.returnData;
        } else {
          return null;
        }
      } else {
        toast.error(`Error: ${res?.status}`);
        return undefined;
      }
    })
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return undefined;
    });
  return {
    props: {
      productDetails: data,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let data = await callApi(processIDs?.get_all_products, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            return null;
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return null;
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return null;
    });
  const paths = data.map((i: any) => ({
    params: { slug: i._id },
  }));
  return { paths, fallback: true };
}

export default ProductPage;
