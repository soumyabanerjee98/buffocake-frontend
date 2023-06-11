import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import {
  callApi,
  metaTitleGenerate,
  metaUrlGenerate,
} from "../../../projectComponents/Functions/util";
import Catagory from "../../../projectComponents/Pages/Catagory";
import PageNotFound from "../../../projectComponents/Pages/PageNotFound";

const SubCatagoryPage = (props: any) => {
  const { subCatagoryProducts, subCatagoryName } = props;
  const router = useRouter();
  if (router.isFallback || subCatagoryProducts === undefined) {
    return <>Loading...</>;
  }
  return (
    <>
      {subCatagoryProducts && subCatagoryName ? (
        <>
          <Head>
            <title>{subCatagoryName}</title>
            <link rel="icon" href="../boffocake-logo.png" />
            <meta name="description" content={subCatagoryName} />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Catagory
            catagoryName={subCatagoryName}
            productList={subCatagoryProducts}
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
  let subCatagoryName = "";
  data?.map((v: any) => {
    v?.subCatagory?.map((w: any) => {
      if (w?.subCatagoryName === metaTitleGenerate(params?.slug)) {
        arr.push(v);
        subCatagoryName = w?.subCatagoryName;
      }
    });
  });

  return {
    props: {
      subCatagoryProducts: arr,
      subCatagoryName: subCatagoryName,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  let data = await callApi(processIDs?.get_subcatagory, {})
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
    params: { slug: metaUrlGenerate(i?.subCatagory) },
  }));

  return { paths, fallback: true };
}
export default SubCatagoryPage;
