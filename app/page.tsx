import React from "react";
import { processIDs } from "../config/processID";
import { callApiISR } from "../projectComponents/Functions/util";
import Home from "../projectComponents/Pages/Home";

const HomePage = async () => {
  const data = await callApiISR(processIDs?.get_all_products, {}).then(
    (res: any) => {
      return res.json();
    }
  );
  return <Home allProducts={data?.returnData} />;
};

export default HomePage;
