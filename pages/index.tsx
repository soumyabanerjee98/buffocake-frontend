import Head from "next/head";
import { metaConfig } from "../config/siteConfig";
import { processIDs } from "../config/processID";
import BasicLayout from "../projectComponents/UI/BasicLayout";
import Home from "../projectComponents/Pages/Home";
import { callApi } from "../projectComponents/Functions/util";

const HomePage = (props: any) => {
  const { allProducts } = props;
  return (
    <>
      <Head>
        <title>{metaConfig?.home_title}</title>
        <meta name="description" content={metaConfig?.home_desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BasicLayout>
        <Home allProducts={allProducts} />
      </BasicLayout>
    </>
  );
};
export async function getStaticProps() {
  let data = await callApi(processIDs?.get_all_products, {}).then(
    (res: any) => {
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
