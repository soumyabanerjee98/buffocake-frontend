import Head from "next/head";
import { metaConfig } from "../config/siteConfig";
import { processIDs } from "../config/processID";
import Home from "../projectComponents/Pages/Home";
import { callApi } from "../projectComponents/Functions/util";
import { responseType } from "../typings";

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
  let data = await callApi(processIDs?.get_all_products, {}).then(
    (res: responseType) => {
      if (res?.data?.returnCode) {
        return res?.data?.returnData;
      } else {
        return null;
      }
    }
  );
  return {
    props: {
      allProducts: data,
    },
    revalidate: 10,
  };
}
export default HomePage;
