import Head from "next/head";
import { labelConfig, metaConfig, serverConfig } from "../config/siteConfig";
import { processIDs } from "../config/processID";
import Home from "../projectComponents/Pages/Home";
import { callApi } from "../projectComponents/Functions/util";
import { responseType } from "../typings";
import { toast } from "react-toastify";
import Script from "next/script";

const HomePage = (props: any) => {
  const { allProducts, carousel } = props;
  return (
    <>
      <Head>
        <title>{metaConfig?.home_title}</title>
        <meta name="description" content={metaConfig?.home_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        src="https://widget.taggbox.com/embed-lite.min.js"
        type="text/javascript"
      />
      <Home allProducts={allProducts} carousel={carousel} />
    </>
  );
};
export async function getStaticProps() {
  let data = await callApi(processIDs?.get_all_products, {})
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
  let catagory = await callApi(processIDs?.get_catagory, {})
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
  let subcatagory = await callApi(processIDs?.get_subcatagory, {})
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
  let carousel = await callApi(processIDs?.get_carousel, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            toast.error(`${res?.data?.msg}`);
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
  let arr: any = [];
  catagory
    ?.sort((a: any, b: any) => {
      return a?.priority - b?.priority;
    })
    ?.map((i: any) => {
      let arrObj = {
        catId: i?._id,
        cat: i?.catagory,
        type: "catagory",
        prod: [],
      };
      data?.map((v: any) => {
        v?.catagory?.map((w: any) => {
          if (w?.catagoryId === i?._id) {
            // @ts-ignore
            arrObj?.prod.push(v);
          }
        });
      });
      arr.push(arrObj);
    });
  subcatagory
    ?.sort((a: any, b: any) => {
      return a?.priority - b?.priority;
    })
    ?.map((i: any) => {
      let arrObj = {
        catId: i?._id,
        cat: i?.subCatagory,
        type: "subCatagory",
        prod: [],
      };
      data?.map((v: any) => {
        v?.subCatagory?.map((w: any) => {
          if (w?.subCatagoryId === i?._id) {
            // @ts-ignore
            arrObj?.prod.push(v);
          }
        });
      });
      arr.push(arrObj);
    });
  return {
    props: {
      // @ts-ignore
      allProducts: arr,
      carousel: carousel,
    },
    revalidate: 60,
  };
}
export default HomePage;
