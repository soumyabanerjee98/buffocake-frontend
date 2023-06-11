import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import {
  callApi,
  metaTitleGenerate,
} from "../../../projectComponents/Functions/util";
import Catagory from "../../../projectComponents/Pages/Catagory";
import PageNotFound from "../../../projectComponents/Pages/PageNotFound";
import { metaUrlGenerate } from "../../../projectComponents/Functions/util";

const CatagoryPage = (props: any) => {
  const { catagoryProducts, catagoryName } = props;
  const router = useRouter();
  if (router.isFallback || catagoryProducts === undefined) {
    return <>Loading...</>;
  }
  return (
    <>
      {catagoryProducts && catagoryName ? (
        <>
          <Head>
            <title>{catagoryName}</title>
            <link rel="icon" href="../boffocake-logo.png" />
            <meta name="description" content={catagoryName} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Catagory
            catagoryName={catagoryName}
            productList={catagoryProducts}
          />
        </>
      ) : (
        <PageNotFound />
      )}
    </>
  );
};

export async function getStaticProps({ params }: any) {
  let data = await callApi(processIDs?.get_all_products, {}) // @ts-ignore
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
  let arr: any = [];
  let catagoryName = "";
  data?.map((v: any) => {
    v?.catagory?.map((w: any) => {
      if (w?.catagoryName === metaTitleGenerate(params?.slug)) {
        arr.push(v);
        catagoryName = w?.catagoryName;
      }
    });
  });

  return {
    props: {
      catagoryProducts: arr,
      catagoryName: catagoryName,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let data = await callApi(processIDs?.get_catagory, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });
  const paths = data?.map((i: any) => ({
    params: { slug: metaUrlGenerate(i?.catagory) },
  }));
  return { paths, fallback: true };
}
export default CatagoryPage;
