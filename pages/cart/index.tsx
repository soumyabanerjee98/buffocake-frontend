import React, { useEffect, useState } from "react";
import {
  callApi,
  getLocalObjectData,
  getLocalStringData,
  getSessionObjectData,
} from "../../projectComponents/Functions/util";
import { storageConfig } from "../../config/siteConfig";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Head from "next/head";
import { processIDs } from "../../config/processID";
import { responseType } from "../../typings";
import Cart from "../../projectComponents/Pages/Cart";
import { toast } from "react-toastify";

const CartPage = () => {
  const [auth, setAuth] = useState<any>();
  const dataAsyncFunc = async () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      setAuth(getSessionObjectData(storageConfig?.userProfile));
    } else if (getLocalStringData(storageConfig?.jwtToken)) {
      const dataFetcher = () =>
        new Promise((resolve, reject) => {
          callApi(processIDs?.verify_login_token, {
            token: getLocalStringData(storageConfig?.jwtToken),
          }) // @ts-ignore
            .then((res: responseType) => {
              if (res?.status === 200) {
                if (res?.data?.returnCode) {
                  resolve(res?.data?.returnData);
                } else {
                  resolve(null);
                }
              } else {
                resolve(undefined);
                toast.error(`Error: ${res?.status}`);
              }
            })
            .catch((err: any) => {
              resolve(undefined);
              toast.error(`Error: ${err?.message}`);
            });
        });
      let data = await dataFetcher();
      setAuth(data);
    } else {
      setAuth(null);
    }
  };
  useEffect(() => {
    dataAsyncFunc();
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
        <Cart />
      </>
    );
  }
};

export default CartPage;
