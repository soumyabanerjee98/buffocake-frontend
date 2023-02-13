import React, { useEffect, useState } from "react";
import { getLocalObjectData } from "../../projectComponents/Functions/util";
import { storageConfig } from "../../config/siteConfig";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Head from "next/head";

const CartPage = () => {
  const [auth, setAuth] = useState<any>();
  useEffect(() => {
    setAuth(getLocalObjectData(storageConfig?.userProfile));
  }, []);
  if (auth === undefined) {
    return <>Loading...</>;
  }
  if (auth === null) {
    return <PageNotFound />;
  } else {
    return (
      <>
        <Head>
          <title>Cart</title>
          <link rel="icon" href="../boffocake-logo.png" />
          <meta name="description" content={`Cart`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <>Cart</>
      </>
    );
  }
};

export default CartPage;
