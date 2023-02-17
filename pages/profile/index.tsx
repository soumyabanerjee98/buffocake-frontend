import React, { useEffect, useState } from "react";
import {
  callApi,
  getLocalObjectData,
  getLocalStringData,
  getSessionObjectData,
} from "../../projectComponents/Functions/util";
import { storageConfig } from "../../config/siteConfig";
import Profile from "../../projectComponents/Pages/Profile";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Head from "next/head";
import { messageService } from "../../projectComponents/Functions/messageService";
import { processIDs } from "../../config/processID";
import { responseType } from "../../typings";
import { toast } from "react-toastify";

const ProfilePage = () => {
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
      setAuth(null);
    }
  };
  useEffect(() => {
    dataAsyncFunc();
    messageService?.onReceive().subscribe((m: any) => {
      if (m?.sender === "profile-page" && m?.target === "global") {
        if (m?.message?.action === "refresh-profile") {
          setAuth(getSessionObjectData(storageConfig?.userProfile));
        }
      }
    });
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
          <title>
            {auth?.firstName} {auth?.lastName}
          </title>
          <link rel="icon" href="../boffocake-logo.png" />
          <meta
            name="description"
            content={`${auth?.firstName} ${auth?.lastName}`}
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Profile profile={auth} />
      </>
    );
  }
};

export default ProfilePage;
