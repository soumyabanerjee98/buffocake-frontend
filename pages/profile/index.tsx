import React, { useEffect, useState } from "react";
import { getSessionObjectData } from "../../projectComponents/Functions/util";
import { storageConfig } from "../../config/siteConfig";
import Profile from "../../projectComponents/Pages/Profile";
import PageNotFound from "../../projectComponents/Pages/PageNotFound";
import Head from "next/head";
import { messageService } from "../../projectComponents/Functions/messageService";

const ProfilePage = () => {
  const [auth, setAuth] = useState<any>();
  useEffect(() => {
    setAuth(getSessionObjectData(storageConfig?.userProfile));
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
