import React from "react";
import { processIDs } from "../../../config/processID";
import { callApiISR } from "../../../projectComponents/Functions/util";

const ProductPageHead = async ({ params }: any) => {
  const data = await callApiISR(processIDs?.get_product_details, {
    productId: params.slug,
  }).then((res: any) => {
    return res.json();
  });
  return (
    <>
      <title>{data?.returnData?.metaHead}</title>
      <link rel="icon" href="../boffocake-logo.png" />
      <meta name="description" content={data?.returnData?.metaDesc} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export default ProductPageHead;
