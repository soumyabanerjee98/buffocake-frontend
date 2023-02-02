import React from "react";
import { processIDs } from "../../../config/processID";
import {
  callApiISR,
  callApiSSG,
} from "../../../projectComponents/Functions/util";
import Products from "../../../projectComponents/Pages/Products";
import { notFound } from "next/navigation";

const ProductPage = async ({ params }: any) => {
  const data = await callApiISR(processIDs?.get_product_details, {
    productId: params.slug,
  }).then((res: any) => {
    return res.json();
  });
  if (!data?.returnCode) return notFound();
  return <Products productDetails={data?.returnData} />;
};

export async function generateStaticParams() {
  let data = await callApiSSG(processIDs?.get_all_products, {}).then(
    (res: any) => {
      return res.json();
    }
  );
  const paths = data?.returnData?.map((i: any) => ({
    slug: i._id,
  }));
  return paths;
}

export default ProductPage;
