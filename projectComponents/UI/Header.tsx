"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useSwr from "swr";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import { labelConfig, storageConfig } from "../../config/siteConfig";
import Logo from "../Assets/Images/boffocake-logo.png";
import SearchIcon from "../Assets/Images/search-icon.svg";
import { messageService } from "../Functions/messageService";
import {
  callApiSSR,
  getLocalStringData,
  getSessionObjectData,
  removeLocalData,
  setSessionObjectData,
} from "../Functions/util";
import CartIcon from "./Icons/CartIcon";
import NameIcon from "./Icons/NameIcon";
import ProfileIcon from "./Icons/ProfileIcon";
import Loading from "./Loading";
import LoginCard from "./LoginCard";

const dataFetcher = async () => {
  if (getSessionObjectData(storageConfig?.userProfile)) {
    return getSessionObjectData(storageConfig?.userProfile);
  } else {
    if (getLocalStringData(storageConfig?.jwtToken)) {
      let data = await callApiSSR(processIDs?.verify_login_token, {
        token: getLocalStringData(storageConfig?.jwtToken),
      }).then((res: any) => {
        return res.json();
      });
      if (data?.returnCode) {
        setSessionObjectData(storageConfig?.userProfile, data?.returnData);
        return data?.returnData;
      } else {
        removeLocalData(storageConfig?.jwtToken);
        return null;
      }
    } else {
      return null;
    }
  }
};

const Header = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const {
    data: userData,
    error,
    isLoading,
  } = useSwr(processIDs?.verify_login_token, dataFetcher);
  const [userProfile, setUserProfile] = useState(userData);
  const [loginCardOpen, setLoginCardOpen] = useState(false);
  const redirect = useRouter();
  const navigate = (url: string) => {
    redirect.push(url);
  };
  const searchByType = (e: any) => {
    let text = e.target.value;
    setSearchTxt(text);
  };
  const openPopUp = () => {
    setLoginCardOpen(true);
  };
  useEffect(() => {
    messageService?.onReceive().subscribe((m: any) => {
      if (m?.sender === "login-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setLoginCardOpen(false);
        }
        if (m?.message?.action === "refresh-profile") {
          setUserProfile(getSessionObjectData(storageConfig?.userProfile));
        }
      } else if (m?.sender === "product-page" && m?.target === "header") {
        if (m?.message?.action === "login-popup") {
          setLoginCardOpen(true);
        }
      }
    });
  }, []);
  useEffect(() => {
    setUserProfile(userData);
  }, [userData]);
  return (
    <header className="main-header">
      <div className="left-col">
        <Image
          src={Logo}
          alt="Boffocake Logo"
          className="logo-image"
          priority={true}
          onClick={() => navigate("/")}
        />
        <div className="header-search">
          <input
            type={"text"}
            value={searchTxt}
            onChange={searchByType}
            placeholder={labelConfig?.header_search_placeholder}
          />
          <div className="search-button">
            <Image src={SearchIcon} alt="Search" />
          </div>
        </div>
      </div>
      <div className="right-col">
        <CartIcon
          fill="rgb(107, 39, 51)"
          className="cart-image"
          textColor="rgb(107, 39, 51)"
        />
        <div className="profile-container">
          {isLoading ? (
            <Loading className="spinner" />
          ) : (
            <>
              {userProfile !== null ? (
                <NameIcon
                  firstName={userProfile?.firstName}
                  lastName={userProfile?.lastName}
                  className="name-icon"
                />
              ) : (
                <ProfileIcon
                  fill="rgb(107, 39, 51)"
                  className="profile-icon"
                  textColor="rgb(107, 39, 51)"
                  onClick={openPopUp}
                />
              )}
            </>
          )}
        </div>
      </div>
      {loginCardOpen && <LoginCard />}
    </header>
  );
};

export default Header;
