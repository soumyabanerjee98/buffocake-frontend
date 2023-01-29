import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import { labelConfig, storageConfig } from "../../config/siteConfig";
import Logo from "../Assets/Images/boffocake-logo.png";
import SearchIcon from "../Assets/Images/search-icon.svg";
import { messageService } from "../Functions/messageService";
import {
  callApi,
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

const Header = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const [userProfile, setUserProfile] = useState<any>({
    loaded: false,
    profile: null,
  });
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
    if (getSessionObjectData(storageConfig?.userProfile)) {
      setUserProfile((prev: any) => {
        return {
          ...prev,
          loaded: true,
          profile: getSessionObjectData(storageConfig?.userProfile),
        };
      });
    } else {
      if (getLocalStringData(storageConfig?.jwtToken)) {
        callApi(processIDs?.verify_login_token, {
          token: getLocalStringData(storageConfig?.jwtToken),
        }).then((res: any) => {
          if (res?.data?.returnCode) {
            setUserProfile((prev: any) => {
              return {
                ...prev,
                loaded: true,
                profile: res?.data?.returnData,
              };
            });
            setSessionObjectData(
              storageConfig?.userProfile,
              res?.data?.returnData
            );
          } else {
            setUserProfile((prev: any) => {
              return {
                ...prev,
                loaded: true,
              };
            });
            removeLocalData(storageConfig?.jwtToken);
          }
        });
      } else {
        setUserProfile((prev: any) => {
          return {
            ...prev,
            loaded: true,
          };
        });
      }
    }
    messageService?.onReceive().subscribe((m: any) => {
      if (m?.sender === "login-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setLoginCardOpen(false);
        }
        if (m?.message?.action === "refresh-profile") {
          setUserProfile((prev: any) => {
            return {
              ...prev,
              loaded: true,
              profile: getSessionObjectData(storageConfig?.userProfile),
            };
          });
        }
      }
    });
  }, []);
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
          {userProfile?.loaded ? (
            <>
              {userProfile?.profile !== null ? (
                <NameIcon
                  firstName={userProfile?.profile?.firstName}
                  lastName={userProfile?.profile?.lastName}
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
          ) : (
            <Loading className="spinner" />
          )}
        </div>
      </div>
      {loginCardOpen && <LoginCard />}
    </header>
  );
};

export default Header;
