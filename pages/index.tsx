import Head from "next/head";
import { metaConfig } from "../config/siteConfig";
import { processIDs } from "../config/processID";
import Home from "../projectComponents/Pages/Home";
import { callApi } from "../projectComponents/Functions/util";
import { responseType } from "../typings";
import { toast } from "react-toastify";

const HomePage = (props: any) => {
  const { allProducts } = props;
  return (
    <>
      <Head>
        <title>{metaConfig?.home_title}</title>
        <meta name="description" content={metaConfig?.home_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Home allProducts={allProducts} />
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
  // @ts-ignore
  let arr = [];
  catagory?.map((i: any) => {
    let arrObj = { cat: i?.catagory, prod: [] };
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
  return {
    props: {
      // @ts-ignore
      allProducts: arr,
    },
    revalidate: 60,
  };
}
export default HomePage;
