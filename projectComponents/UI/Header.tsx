import Image from "next/image";
import { useRouter } from "next/router";
import useSwr from "swr";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import {
  colorConfig,
  labelConfig,
  serverConfig,
  storageConfig,
  styleConfig,
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
  getSessionObjectData,
  setSessionObjectData,
  removeSessionData,
  openTab,
  metaUrlGenerate,
} from "../Functions/util";
import CartIcon from "./Icons/CartIcon";
import NameIcon from "./Icons/NameIcon";
import ProfileIcon from "./Icons/ProfileIcon";
import Loading from "./Loading";
import LoginCard from "./LoginCard";
import { messageType, responseType } from "../../typings";
import ForgotPasswordCard from "./ForgotPasswordCard";
import PhoneVerifyCard from "./PhoneVerifyCard";
import FavIcon from "./Icons/FavIcon";
import OrderIcon from "./Icons/OrderIcon";
import CheckoutCard from "./CheckoutCard";
import { toast } from "react-toastify";
import AddressCard from "./AddressCard";
import OrderSuccessCard from "./OrderSuccessCard";
import OrderReceipt from "./OrderReceipt";
import Navbar from "./Navbar";
const GetAllCatagories = async () => {
  let catData = await callApi(processIDs?.get_catagory, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            toast.error(`${res?.data?.msg}`);
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });
  let subCatData = await callApi(processIDs?.get_subcatagory, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            toast.error(`${res?.data?.msg}`);
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });

  return { cat: catData, subCat: subCatData };
};
const GetAllProducts = async () => {
  let data = await callApi(processIDs?.get_all_products, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            toast.error(`${res?.data?.msg}`);
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });
  return data;
};

const Header = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [profileRoutes, setProfileRoutes] = useState(false);
  const url =
    process.env.NODE_ENV === "production"
      ? serverConfig?.backend_url_server
      : serverConfig?.backend_url_test;
  const [userProfile, setUserProfile] = useState<any>();
  const [loginCardOpen, setLoginCardOpen] = useState(false);
  const [forgotPasswordCardOpen, setForgotPasswordCardOpen] = useState(false);
  const [phoneVerifyCardOpen, setPhoneVerifyCardOpen] = useState(false);
  const [checkOutCardOpen, setCheckOutCardOpen] = useState({
    state: false,
    source: "",
    cart: [],
  });
  const [addressCardOpen, setAddressCardOpen] = useState<any>({
    state: false,
    receiverName: "",
    receiverContact: "",
    house: "",
    street: "",
    pin: null,
    fav: false,
    action: "",
    addressId: "",
  });
  const [orderSuccessCardOpen, setOrderSuccessCardOpen] = useState({
    state: false,
    order: {},
  });
  const [receiptCardOpen, setReceiptCardOpen] = useState({
    state: false,
    order: {},
  });
  const {
    data: products,
    isLoading: productLoading,
    error: productError,
  } = useSwr("header-get-products", GetAllProducts, { refreshInterval: 30000 });
  const {
    data: catagories,
    isLoading: catagoryLoading,
    error: catagoryError,
  } = useSwr("header-get-catagories", GetAllCatagories, {
    refreshInterval: 30000,
  });
  const [allProducts, setAllProducts] = useState<any>(products);
  const [allCatagory, setAllCatagory] = useState({
    catArr: catagories?.cat,
    subCatArr: catagories?.subCat,
  });
  const [searchResult, setSearchResult] = useState([]);
  const [catagorySearchResult, setCatagorySearchResult] = useState({
    cat: [],
    subCat: [],
  });
  const redirect = useRouter();
  const navigate = (url: string) => {
    redirect.push(url);
  };
  const searchByType = (e: any) => {
    let text = e.target.value;
    setSearchTxt(text);
    if (text === "") {
      setSearchResult([]);
      setCatagorySearchResult((prev: any) => {
        return {
          ...prev,
          cat: [],
          subCat: [],
        };
      });
    } else {
      let arr: any = [];
      let catArr: any = [];
      let subCatArr: any = [];
      let filteredArr = [];
      let filteredCatArr: any = [];
      let filteredSubCatArr: any = [];
      allProducts?.map((i: any) => {
        let searchTitle = i?.title?.toLowerCase()?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          arr.push(i);
        }
      });
      allCatagory?.catArr?.map((i: any) => {
        let searchTitle = i?.catagory
          ?.toLowerCase()
          ?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          catArr.push(i);
        }
      });
      allCatagory?.subCatArr?.map((i: any) => {
        let searchTitle = i?.subCatagory
          ?.toLowerCase()
          ?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          subCatArr.push(i);
        }
      });
      filteredArr = arr.filter((i: any, v: number) => {
        return v <= 4;
      });
      filteredCatArr = catArr.filter((i: any, v: number) => {
        return v <= 1;
      });
      filteredSubCatArr = subCatArr.filter((i: any, v: number) => {
        return v <= 1;
      });
      setSearchResult(filteredArr);
      setCatagorySearchResult((prev: any) => {
        return { ...prev, cat: filteredCatArr, subCat: filteredSubCatArr };
      });
    }
  };
  const openPopUp = () => {
    setLoginCardOpen(true);
  };
  const openProfile = () => {
    if (window.screen.width < styleConfig?.mobile_width) {
      setProfileRoutes((prev) => !prev);
      return;
    }
    navigate("/profile");
  };

  const closeProfileRoute = (e: any) => {
    if (
      !Array.from(e.target.classList).includes("routes") &&
      !Array.from(e.target.classList).includes("profile-route-popup") &&
      !Array.from(e.target.classList).includes("name-icon") &&
      !Array.from(e.target.classList).includes("profile-icon-photo")
    ) {
      setProfileRoutes(false);
    }
  };

  const navigateRoutes = (path: string) => {
    navigate(path);
    setProfileRoutes(false);
  };

  useEffect(() => {
    setAllProducts(products);
    setAllCatagory((prev: any) => {
      return {
        ...prev,
        catArr: catagories?.cat,
        subCatArr: catagories?.subCat,
      };
    });
  }, [products, catagories]);

  useEffect(() => {
    // @ts-ignore
    messageService?.onReceive().subscribe((m: messageType) => {
      if (m?.sender === "login-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setLoginCardOpen(false);
        }
        if (m?.message?.action === "refresh-profile") {
          setUserProfile(getSessionObjectData(storageConfig?.userProfile));
        }
        if (m?.message?.action === "forgot-password") {
          setForgotPasswordCardOpen(true);
        }
      } else if (m?.sender === "product-page" && m?.target === "header") {
        if (m?.message?.action === "login-popup") {
          setLoginCardOpen(true);
        }
      } else if (
        m?.sender === "product-page" &&
        m?.target === "checkout-card"
      ) {
        if (m?.message?.action === "checkout") {
          setCheckOutCardOpen((prev: any) => {
            return {
              ...prev,
              state: true,
              source: m?.sender,
              cart: m?.message?.params,
            };
          });
        }
      } else if (m?.sender === "cart-page" && m?.target === "checkout-card") {
        if (m?.message?.action === "checkout") {
          setCheckOutCardOpen((prev: any) => {
            return {
              ...prev,
              state: true,
              source: m?.sender,
              cart: m?.message?.params,
            };
          });
        }
      } else if (m?.sender === "checkout-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setCheckOutCardOpen((prev: any) => {
            return {
              ...prev,
              state: false,
              source: "",
              cart: [],
            };
          });
        }
      } else if (m?.sender === "profile-page" && m?.target === "global") {
        if (m?.message?.action === "refresh-profile") {
          setUserProfile(getSessionObjectData(storageConfig?.userProfile));
        } else if (m?.message?.action === "phone-verify") {
          setPhoneVerifyCardOpen(true);
        } else if (m?.message?.action === "logout") {
          removeSessionData(storageConfig?.userProfile);
          removeSessionData(storageConfig?.address);
          removeSessionData(storageConfig?.cart);
          removeSessionData(storageConfig?.wishlist);
          removeSessionData(storageConfig?.orders);
          navigate("/");
          removeLocalData(storageConfig?.jwtToken);
          setUserProfile(null);
        }
      } else if (m?.sender === "admin-page" && m?.target === "global") {
        if (m?.message?.action === "logout") {
          removeSessionData(storageConfig?.userProfile);
          removeSessionData(storageConfig?.address);
          removeSessionData(storageConfig?.cart);
          removeSessionData(storageConfig?.wishlist);
          removeSessionData(storageConfig?.orders);
          navigate("/");
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
        } else if (m?.message?.action === "add-address") {
          setAddressCardOpen((prev: any) => {
            return {
              ...prev,
              state: true,
              receiverName: m?.message?.params?.name,
              receiverContact: m?.message?.params?.contact,
              fav: m?.message?.params?.fav,
              action: m?.message?.action,
            };
          });
        } else if (m?.message?.action === "edit-address") {
          setAddressCardOpen((prev: any) => {
            return {
              ...prev,
              state: true,
              addressId: m?.message?.params?.addressId,
              receiverName: m?.message?.params?.name,
              receiverContact: m?.message?.params?.contact,
              house: m?.message?.params?.house,
              street: m?.message?.params?.street,
              pin: m?.message?.params?.pin,
              fav: m?.message?.params?.fav,
              action: m?.message?.action,
            };
          });
        }
      } else if (
        m?.sender === "forgot-password-card" &&
        m?.target === "header"
      ) {
        if (m?.message?.action === "close-popup") {
          setForgotPasswordCardOpen(false);
        }
      } else if (m?.sender === "address-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setAddressCardOpen((prev: any) => {
            return {
              ...prev,
              state: false,
              receiverName: "",
              receiverContact: "",
              house: "",
              street: "",
              pin: null,
              fav: false,
              action: "",
              addressId: "",
            };
          });
        }
      } else if (m?.sender === "checkout-card" && m?.target === "global") {
        if (
          m?.message?.action === "clear-cart-payment-successfull" ||
          m?.message?.action === "payment-successfull"
        ) {
          setCheckOutCardOpen((prev: any) => {
            return {
              ...prev,
              state: false,
              source: "",
              cart: [],
            };
          });
          setOrderSuccessCardOpen((prev: any) => {
            return { ...prev, order: m?.message?.params?.order, state: true };
          });
        } else if (m?.message?.action === "add-address") {
          setAddressCardOpen((prev: any) => {
            return {
              ...prev,
              state: true,
              receiverName: m?.message?.params?.name,
              receiverContact: m?.message?.params?.contact,
              fav: m?.message?.params?.fav,
              action: m?.message?.action,
            };
          });
        }
      } else if (m?.sender === "order-success-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setOrderSuccessCardOpen((prev: any) => {
            return { ...prev, order: {}, state: false };
          });
        }
      } else if (m?.sender === "receipt-card" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setReceiptCardOpen((prev: any) => {
            return { ...prev, state: false, order: {} };
          });
        }
      } else if (m?.sender === "order-item-card" && m?.target === "header") {
        setReceiptCardOpen((prev: any) => {
          return { ...prev, state: true, order: m?.message?.params };
        });
      } else if (m?.sender === "navbar" && m?.target === "header") {
        if (m?.message?.action === "close-popup") {
          setNavbarOpen(false);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      setUserProfile(getSessionObjectData(storageConfig?.userProfile));
    } else {
      if (getLocalStringData(storageConfig?.jwtToken)) {
        callApi(processIDs?.verify_login_token, {
          token: getLocalStringData(storageConfig?.jwtToken),
        }) // @ts-ignore
          .then((res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                setSessionObjectData(
                  storageConfig?.userProfile,
                  res?.data?.returnData
                );
                setUserProfile(res?.data?.returnData);
              } else {
                removeLocalData(storageConfig?.jwtToken);
                setUserProfile(null);
              }
            } else {
              toast.error(`Error: ${res?.status}`);
              setUserProfile(undefined);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err?.message}`);
            setUserProfile(undefined);
          });
      } else {
        setUserProfile(null);
      }
    }
    window.addEventListener("click", closeProfileRoute);
  }, []);

  return (
    <header className="main-header">
      <div className="left-col">
        <i
          className="fa-solid fa-lg fa-bars hamburger"
          onClick={() => {
            setNavbarOpen(true);
          }}
        />
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
          <div
            className="search-button"
            onClick={() => {
              setSearchTxt("");
              setSearchResult([]);
              setCatagorySearchResult((prev: any) => {
                return { ...prev, cat: [], subCat: [] };
              });
            }}
          >
            <i className="fas fa-undo" />
          </div>
        </div>
        {(searchResult?.length > 0 ||
          catagorySearchResult?.cat?.length > 0 ||
          catagorySearchResult?.subCat?.length > 0) && (
          <div className="search-result">
            {searchResult?.map((i: any) => {
              return (
                <div
                  className="search-items"
                  onClick={() => {
                    openTab(`/product/${metaUrlGenerate(i?.metaHead)}`);
                    setSearchTxt("");
                    setSearchResult([]);
                    setCatagorySearchResult((prev: any) => {
                      return {
                        ...prev,
                        cat: [],
                        subCat: [],
                      };
                    });
                  }}
                >
                  {i?.title}
                </div>
              );
            })}
            {catagorySearchResult?.cat?.length > 0 && (
              <>
                <div className="division-title">Catagories</div>
                {catagorySearchResult?.cat?.map((i: any) => {
                  return (
                    <div
                      className="search-items"
                      onClick={() => {
                        navigate(`/catagory/${i?._id}`);
                        setSearchTxt("");
                        setSearchResult([]);
                        setCatagorySearchResult((prev: any) => {
                          return {
                            ...prev,
                            cat: [],
                            subCat: [],
                          };
                        });
                      }}
                    >
                      {i?.catagory}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      <div className="right-col">
        {userProfile && (
          <>
            <OrderIcon
              fill={colorConfig?.s_3}
              className="icon-image"
              textColor={colorConfig?.s_3}
              onClick={() => {
                navigate("/orders");
              }}
            />
            <FavIcon
              fill={colorConfig?.s_3}
              className="icon-image"
              textColor={colorConfig?.s_3}
              onClick={() => {
                navigate("/wishlist");
              }}
            />
            <CartIcon
              fill={colorConfig?.s_3}
              className="icon-image"
              textColor={colorConfig?.s_3}
              onClick={() => {
                navigate("/cart");
              }}
            />
          </>
        )}
        <div className="profile-container">
          {userProfile === undefined ? (
            <Loading className="spinner" />
          ) : (
            <>
              {userProfile !== null ? (
                <div className="profile-route">
                  {userProfile?.profilePhoto ? (
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
                  )}
                  {profileRoutes && (
                    <div className="profile-route-popup">
                      <div
                        className="routes"
                        onClick={() => {
                          navigateRoutes("/profile");
                        }}
                      >
                        My profile
                      </div>
                      <div
                        className="routes"
                        onClick={() => {
                          navigateRoutes("/orders");
                        }}
                      >
                        Orders
                      </div>
                      <div
                        className="routes"
                        onClick={() => {
                          navigateRoutes("/wishlist");
                        }}
                      >
                        Wishlist
                      </div>
                      <div
                        className="routes"
                        onClick={() => {
                          navigateRoutes("/cart");
                        }}
                      >
                        Cart
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <ProfileIcon
                  fill={colorConfig?.s_3}
                  className="profile-icon"
                  textColor={colorConfig?.s_3}
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
      {checkOutCardOpen?.state && (
        <CheckoutCard
          source={checkOutCardOpen?.source}
          cart={checkOutCardOpen?.cart}
        />
      )}
      {addressCardOpen?.state && (
        <AddressCard
          receiverName={addressCardOpen?.receiverName}
          receiverContact={addressCardOpen?.receiverContact}
          house={addressCardOpen?.house}
          street={addressCardOpen?.street}
          pin={addressCardOpen?.pin}
          fav={addressCardOpen?.fav}
          action={addressCardOpen?.action}
          addressId={addressCardOpen?.addressId}
        />
      )}
      {orderSuccessCardOpen?.state && (
        <OrderSuccessCard order={orderSuccessCardOpen?.order} />
      )}
      {receiptCardOpen?.state && (
        <OrderReceipt order={receiptCardOpen?.order} />
      )}
      {navbarOpen && <Navbar products={products} catagories={catagories} />}
    </header>
  );
};

export default Header;
