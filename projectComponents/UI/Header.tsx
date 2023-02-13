import Image from "next/image";
import { useRouter } from "next/router";
import useSwr from "swr";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import {
  labelConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import Logo from "../Assets/Images/boffocake-logo.png";
import SearchIcon from "../Assets/Images/search-icon.svg";
import { messageService } from "../Functions/messageService";
import {
  callApi,
  getLocalStringData,
  getLocalObjectData,
  removeLocalData,
  setLocalObjectData,
} from "../Functions/util";
import CartIcon from "./Icons/CartIcon";
import NameIcon from "./Icons/NameIcon";
import ProfileIcon from "./Icons/ProfileIcon";
import Loading from "./Loading";
import LoginCard from "./LoginCard";
import { responseType } from "../../typings";
import ForgotPasswordCard from "./ForgotPasswordCard";
import PhoneVerifyCard from "./PhoneVerifyCard";
import FavIcon from "./Icons/FavIcon";
import OrderIcon from "./Icons/OrderIcon";

const dataFetcher = async () => {
  if (getLocalObjectData(storageConfig?.userProfile)) {
    return getLocalObjectData(storageConfig?.userProfile);
  } else {
    if (getLocalStringData(storageConfig?.jwtToken)) {
      let data = await callApi(processIDs?.verify_login_token, {
        token: getLocalStringData(storageConfig?.jwtToken),
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setLocalObjectData(storageConfig?.userProfile, res?.data?.returnData);
          return res?.data?.returnData;
        } else {
          removeLocalData(storageConfig?.jwtToken);
          return null;
        }
      });
      return data;
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
  const url =
    process.env.NODE_ENV === "production"
      ? serverConfig?.backend_url_server
      : serverConfig?.backend_url_test;
  const [userProfile, setUserProfile] = useState(userData);
  const [loginCardOpen, setLoginCardOpen] = useState(false);
  const [forgotPasswordCardOpen, setForgotPasswordCardOpen] = useState(false);
  const [phoneVerifyCardOpen, setPhoneVerifyCardOpen] = useState(false);
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
  const openProfile = () => {
    navigate("/profile");
  };
  useEffect(() => {
    messageService?.onReceive().subscribe((m: any) => {
      if (m?.sender === "login-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setLoginCardOpen(false);
        }
        if (m?.message?.action === "refresh-profile") {
          setUserProfile(getLocalObjectData(storageConfig?.userProfile));
        }
        if (m?.message?.action === "forgot-password") {
          setForgotPasswordCardOpen(true);
        }
      } else if (m?.sender === "product-page" && m?.target === "header") {
        if (m?.message?.action === "login-popup") {
          setLoginCardOpen(true);
        }
      } else if (m?.sender === "profile-page" && m?.target === "global") {
        if (m?.message?.action === "refresh-profile") {
          setUserProfile(getLocalObjectData(storageConfig?.userProfile));
        } else if (m?.message?.action === "phone-verify") {
          setPhoneVerifyCardOpen(true);
        } else if (m?.message?.action === "logout") {
          navigate("/");
          removeLocalData(storageConfig?.userProfile);
          removeLocalData(storageConfig?.jwtToken);
          setUserProfile(null);
        }
      } else if (m?.sender === "phone-verify-card" && m?.target === "global") {
        if (
          m?.message?.action === "success-verify" ||
          m?.message?.action === "close-popup"
        ) {
          setPhoneVerifyCardOpen(false);
        }
      } else if (m?.sender === "profile-page" && m?.target === "header") {
        if (m?.message?.action === "forgot-password") {
          setForgotPasswordCardOpen(true);
        }
      } else if (
        m?.sender === "forgot-password-card" &&
        m?.target === "header"
      ) {
        if (m?.message?.action === "close-popup") {
          setForgotPasswordCardOpen(false);
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
        {userProfile && (
          <>
            <div
              onClick={() => {
                navigate("/orders");
              }}
            >
              <OrderIcon
                fill="rgb(107, 39, 51)"
                className="cart-image"
                textColor="rgb(107, 39, 51)"
              />
            </div>
            <div
              onClick={() => {
                navigate("/wishlist");
              }}
            >
              <FavIcon
                fill="rgb(107, 39, 51)"
                className="cart-image"
                textColor="rgb(107, 39, 51)"
              />
            </div>
            <div
              onClick={() => {
                navigate("/cart");
              }}
            >
              <CartIcon
                fill="rgb(107, 39, 51)"
                className="cart-image"
                textColor="rgb(107, 39, 51)"
              />
            </div>
          </>
        )}
        <div className="profile-container">
          {isLoading ? (
            <Loading className="spinner" />
          ) : (
            <>
              {userProfile !== null ? (
                userProfile?.profilePhoto ? (
                  <img
                    src={`${url}${userProfile?.profilePhoto}`}
                    className="profile-icon-photo"
                    onClick={openProfile}
                  />
                ) : (
                  <NameIcon
                    firstName={userProfile?.firstName}
                    lastName={userProfile?.lastName}
                    className="name-icon"
                    onClick={openProfile}
                  />
                )
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
      {forgotPasswordCardOpen && <ForgotPasswordCard />}
      {phoneVerifyCardOpen && <PhoneVerifyCard />}
    </header>
  );
};

export default Header;
