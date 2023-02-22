import Head from "next/head";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { storageConfig } from "../../config/siteConfig";
import {
  callApi,
  getLocalStringData,
  getSessionObjectData,
} from "../../projectComponents/Functions/util";
import Admin from "../../projectComponents/Pages/Admin";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";

const AdminPage = () => {
  const [auth, setAuth] = useState<any>();
  const dataAsyncFunc = async () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      if (getSessionObjectData(storageConfig?.userProfile)?.admin) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    } else if (getLocalStringData(storageConfig?.jwtToken)) {
      const dataFetcher = () =>
        new Promise((resolve, reject) => {
          callApi(processIDs?.verify_login_token, {
            token: getLocalStringData(storageConfig?.jwtToken),
          }) // @ts-ignore
            .then((res: responseType) => {
              if (res?.status === 200) {
                if (res?.data?.returnCode) {
                  if (res?.data?.returnData?.admin) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                } else {
                  resolve(false);
                }
              } else {
                toast.error(`Error: ${res?.status}`);
                resolve(undefined);
              }
            })
            .catch((err: any) => {
              toast.error(`Error: ${err?.message}`);
              resolve(undefined);
            });
        });
      let data = await dataFetcher();
      setAuth(data);
    } else {
      setAuth(false);
    }
  };
  useEffect(() => {
    dataAsyncFunc();
  }, []);
  if (auth === undefined) {
    return <>Loading...</>;
  }
  if (auth === false) {
    return <PageNotFound />;
  }
  return (
    <>
      <Head>
        <title>Admin page</title>
        <link rel="icon" href="../boffocake-logo.png" />
        <meta name="description" content={`Admin page`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Admin />
    </>
  );
};

export default AdminPage;
