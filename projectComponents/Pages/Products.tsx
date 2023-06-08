import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import Calendar from "react-calendar";
import Select from "react-select";
import "react-calendar/dist/Calendar.css";
import { processIDs } from "../../config/processID";
import {
  labelConfig,
  productConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
  weightConverter,
} from "../Functions/util";
import HeartIcon from "../UI/Icons/HeartIcon";
import { messageService } from "../Functions/messageService";
import { responseType } from "../../typings";
import Loading from "../UI/Loading";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import VegSign from "../Assets/Images/veg-small.png";

export type ProductProps = {
  productDetails: any;
};

const Products = (props: ProductProps) => {
  const { productDetails } = props;
  const router = useRouter();
  const minDate = new Date();
  const today = new Date();
  const maxDate = new Date();
  const timer = useRef<any>();
  maxDate.setDate(maxDate.getDate() + 8);
  minDate.setDate(minDate.getDate() + 1);
  const [fav, setFav] = useState<any>();
  const [checkOutDetails, setCheckOutDetails] = useState({
    weight: productDetails?.weight?.sort((a: any, b: any) => {
      return a?.value - b?.value;
    })?.[0]?.label,
    subTotal: productDetails?.weight?.sort((a: any, b: any) => {
      return a?.value - b?.value;
    })?.[0]?.value,
    additionalValueFlavour:
      productDetails?.availableFlavours?.length > 0
        ? productDetails?.availableFlavours?.sort((a: any, b: any) => {
            return a?.value - b?.value;
          })?.[0]?.value
        : 0,
    additionalValueGourmet: 0,
    selectedFlavour:
      productDetails?.availableFlavours?.length > 0
        ? productDetails?.availableFlavours?.sort((a: any, b: any) => {
            return a?.value - b?.value;
          })?.[0]?.flavour
        : "",
    message: "",
    customization: "",
    gourmetOption: "",
    allergy: "",
    deliveryDate: productDetails?.sameDay ? today : minDate,
    deliveryTime: null,
    pin: "",
    available: null,
  });
  const [imageArrInd, setImageArrInd] = useState(0);
  const [err, setErr] = useState({
    available: false,
    time: false,
  });
  const [loader, setLoader] = useState({
    buy: false,
    cart: false,
    fav: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [textFieldLimits, setTextFieldLimits] = useState({
    messageLimit: productConfig?.messageFieldLimit,
    allergyLimit: productConfig?.allergyFieldLimit,
    customLimit: productConfig?.customFieldLimit,
  });
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.wishlist)) {
      let data = getSessionObjectData(storageConfig?.wishlist)?.find(
        (i: any) => {
          return i?.productId === productDetails?._id;
        }
      );
      if (data) {
        setFav(true);
      } else {
        setFav(false);
      }
    }
    if (getSessionObjectData(storageConfig?.userProfile)) {
      callApi(processIDs?.get_wishlist, {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      }) // @ts-ignore
        .then((res: responseType) => {
          if (res?.data?.returnCode) {
            let returnStatement;
            if (res?.status === 200) {
              if (res?.data?.returnData) {
                setSessionObjectData(
                  storageConfig?.wishlist,
                  res?.data?.returnData
                );
                let data = res?.data?.returnData?.find((i: any) => {
                  return i?.productId === productDetails?._id;
                });
                if (data) {
                  returnStatement = true;
                } else {
                  returnStatement = false;
                }
              } else {
                setSessionObjectData(storageConfig?.wishlist, []);
                returnStatement = false;
              }
            } else {
              toast.error(`Error: ${res?.status}`);
              returnStatement = undefined;
            }
            setFav(returnStatement);
          } else {
            setFav(false);
          }
        })
        .catch((err: any) => {
          toast.error(`Error: ${err?.message}`);
          setFav(undefined);
        });
    } else {
      setFav(false);
    }
  }, []);

  const loginCardOpen = () => {
    messageService?.sendMessage(
      "product-page",
      // @ts-ignore
      { action: "login-popup" },
      "header"
    );
  };

  const selectFlavour = (opt: any, index: number) => {
    setErr((prev: any) => {
      return { ...prev, flavours: false };
    });
    setCheckOutDetails((prev: any) => {
      return {
        ...prev,
        selectedFlavour: opt?.flavour,
        additionalValueFlavour: opt?.value,
      };
    });
    let element = document.getElementById(`product-flavour-${index}`);
    productDetails?.availableFlavours?.map((i: any, idx: number) => {
      let element = document.getElementById(`product-flavour-${idx}`);
      element?.classList.remove("selected-option");
    });
    element?.classList.add("selected-option");
  };

  const messageOnCake = (e: any) => {
    if (
      textFieldLimits?.messageLimit > 0 ||
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      setCheckOutDetails((prev: any) => {
        return { ...prev, message: e.target.value };
      });
      setTextFieldLimits((prev: any) => {
        return {
          ...prev,
          messageLimit:
            productConfig?.messageFieldLimit - e.target.value.length,
        };
      });
    }
  };

  const custom = (e: any) => {
    if (
      textFieldLimits?.customLimit > 0 ||
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      setCheckOutDetails((prev: any) => {
        return { ...prev, customization: e.target.value };
      });
      setTextFieldLimits((prev: any) => {
        return {
          ...prev,
          customLimit: productConfig?.customFieldLimit - e.target.value.length,
        };
      });
    }
  };

  const selectGourmet = (opt: any, index: number) => {
    let element = document.getElementById(`product-gourmet-${index}`);
    if (element?.className.includes("selected-option")) {
      productDetails?.gourmetOptions?.map((i: any, idx: number) => {
        let element = document.getElementById(`product-gourmet-${idx}`);
        element?.classList.remove("selected-option");
      });
      setCheckOutDetails((prev: any) => {
        return {
          ...prev,
          gourmetOption: null,
          additionalValueGourmet: 0,
        };
      });
    } else {
      productDetails?.gourmetOptions?.map((i: any, idx: number) => {
        let element = document.getElementById(`product-gourmet-${idx}`);
        element?.classList.remove("selected-option");
      });
      element?.classList.add("selected-option");
      setCheckOutDetails((prev: any) => {
        return {
          ...prev,
          gourmetOption: opt?.option,
          additionalValueGourmet: opt?.value,
        };
      });
    }
  };

  const allergyText = (e: any) => {
    if (
      textFieldLimits?.allergyLimit > 0 ||
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      setCheckOutDetails((prev: any) => {
        return { ...prev, allergy: e.target.value };
      });
      setTextFieldLimits((prev: any) => {
        return {
          ...prev,
          allergyLimit:
            productConfig?.allergyFieldLimit - e.target.value.length,
        };
      });
    }
  };

  const favSelect = () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      setLoader((prev: any) => {
        return { ...prev, fav: true };
      });
      if (fav) {
        callApi(processIDs?.remove_item_from_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          productId: productDetails?._id,
        }) // @ts-ignore
          .then((res: responseType) => {
            setLoader((prev: any) => {
              return { ...prev, fav: false };
            });
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                setFav(false);
                setSessionObjectData(
                  storageConfig?.wishlist,
                  res?.data?.returnData
                );
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err?.message}`);
          });
      } else {
        callApi(processIDs?.add_item_to_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          productId: productDetails?._id,
        }) // @ts-ignore
          .then((res: responseType) => {
            setLoader((prev: any) => {
              return { ...prev, fav: false };
            });
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                setFav(true);
                setSessionObjectData(
                  storageConfig?.wishlist,
                  res?.data?.returnData
                );
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err?.message}`);
          });
      }
    } else {
      loginCardOpen();
    }
  };

  const addToCart = () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      if (!checkOutDetails?.deliveryTime) {
        setErr((prev: any) => {
          return { ...prev, time: true };
        });
      } else if (!checkOutDetails?.available) {
        setErr((prev: any) => {
          return { ...prev, available: true };
        });
      } else {
        setLoader((prev: any) => {
          return { ...prev, cart: true };
        });
        let body = {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          productId: productDetails?._id,
          weight: checkOutDetails?.weight,
          flavour: checkOutDetails?.selectedFlavour,
          gourmet: checkOutDetails?.gourmetOption,
          custom: checkOutDetails?.customization,
          message: checkOutDetails?.message,
          allergy: checkOutDetails?.allergy,
          delDate: checkOutDetails?.deliveryDate?.toDateString(),
          delTime: checkOutDetails?.deliveryTime,
          subTotal:
            checkOutDetails?.additionalValueGourmet +
            checkOutDetails?.additionalValueFlavour +
            checkOutDetails?.subTotal +
            ((checkOutDetails?.subTotal +
              checkOutDetails?.additionalValueFlavour +
              checkOutDetails?.additionalValueGourmet) *
              productConfig?.deliveryCharge) /
              100,
        };

        callApi(processIDs?.add_item_to_cart, body)
          // @ts-ignore
          .then((res: responseType) => {
            setLoader((prev: any) => {
              return { ...prev, cart: false };
            });
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                setSessionObjectData(
                  storageConfig?.cart,
                  res?.data?.returnData
                );
                messageService?.sendMessage(
                  "product-page",
                  // @ts-ignore
                  {
                    action: "refresh-count",
                    params: res?.data?.returnData?.length,
                  },
                  "cart-icon"
                );
                router.push("/cart");
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err?.message}`);
            setLoader((prev: any) => {
              return { ...prev, cart: false };
            });
          });
      }
    } else {
      loginCardOpen();
    }
  };

  const placeOrder = () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      if (!checkOutDetails?.deliveryTime) {
        setErr((prev: any) => {
          return { ...prev, time: true };
        });
      } else if (!checkOutDetails?.available) {
        setErr((prev: any) => {
          return { ...prev, available: true };
        });
      } else {
        let body = {
          productId: productDetails?._id,
          productName: productDetails?.title,
          weight: checkOutDetails?.weight,
          flavour: checkOutDetails?.selectedFlavour,
          gourmet: checkOutDetails?.gourmetOption,
          message: checkOutDetails?.message,
          custom: checkOutDetails?.customization,
          allergy: checkOutDetails?.allergy,
          delDate: checkOutDetails?.deliveryDate?.toDateString(),
          delTime: checkOutDetails?.deliveryTime,
          subTotal:
            checkOutDetails?.additionalValueGourmet +
            checkOutDetails?.additionalValueFlavour +
            checkOutDetails?.subTotal +
            ((checkOutDetails?.subTotal +
              checkOutDetails?.additionalValueFlavour +
              checkOutDetails?.additionalValueGourmet) *
              productConfig?.deliveryCharge) /
              100,
        };
        messageService?.sendMessage(
          "product-page",
          // @ts-ignore
          {
            action: "checkout",
            params: [body],
          },
          "checkout-card"
        );
      }
    } else {
      loginCardOpen();
    }
  };

  const selectWeight = (opt: any, index: number) => {
    let element = document.getElementById(`product-weight-${index}`);
    productDetails?.weight?.map((i: any, idx: number) => {
      let element = document.getElementById(`product-weight-${idx}`);
      element?.classList.remove("selected-option");
    });
    element?.classList.add("selected-option");
    setCheckOutDetails((prev: any) => {
      return {
        ...prev,
        weight: opt?.label,
        subTotal: opt?.value,
      };
    });
  };

  const checkPin = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      // @ts-ignore
      e.nativeEvent.data ||
      // @ts-ignore
      e.nativeEvent.inputType === "deleteContentBackward"
    ) {
      let pin = parseInt(e.target.value);
      let element = document.getElementById("check-pin");
      element?.classList.remove("available", "unavailable");
      setCheckOutDetails((prev: any) => {
        return { ...prev, pin: pin };
      });
      setErr((prev: any) => {
        return { ...prev, available: false };
      });
      if (timer) {
        clearTimeout(timer.current);
      }
      if (pin) {
        timer.current = setTimeout(() => {
          callApi(processIDs?.get_pincodes, {})
            .then(
              // @ts-ignore
              (res: responseType) => {
                if (res?.status === 200) {
                  if (res?.data?.returnCode) {
                    if (res?.data?.returnData.includes(pin)) {
                      element?.classList.add("available");
                      setCheckOutDetails((prev: any) => {
                        return { ...prev, available: true };
                      });
                    } else {
                      element?.classList.add("unavailable");
                      setCheckOutDetails((prev: any) => {
                        return { ...prev, available: false };
                      });
                    }
                  } else {
                    element?.classList.add("unavailable");
                    setCheckOutDetails((prev: any) => {
                      return { ...prev, available: false };
                    });
                  }
                } else {
                  toast.error(`Error: ${res?.status}`);
                  element?.classList.add("unavailable");
                  setCheckOutDetails((prev: any) => {
                    return { ...prev, available: false };
                  });
                }
              }
            )
            .catch((err: any) => {
              toast.error(`Error: ${err?.message}`);
              element?.classList.add("unavailable");
              setCheckOutDetails((prev: any) => {
                return { ...prev, available: false };
              });
            });
        }, 1000);
      }
    }
  };
 
  return (
    <div className="product-screen">
      <div className="left-column">
        <div className="image-section">
          {productDetails?.productImage?.length > 0 ? (
            productDetails?.productImage?.length === 1 ? (
              <img
                src={`${url}${productDetails?.productImage?.[0]?.mediaPath}`}
                alt={labelConfig?.image_not_loaded}
                className="product-image"
              />
            ) : (
              <img
                src={`${url}${productDetails?.productImage?.[imageArrInd]?.mediaPath}`}
                alt={labelConfig?.image_not_loaded}
                className="product-image"
              />
            )
          ) : (
            <Image
              src={NoIMage}
              alt={labelConfig?.image_not_loaded}
              className="product-image"
            />
          )}
          {fav === undefined || loader?.fav ? (
            <div className="fav-loader">
              <Loading className="spinner" />
            </div>
          ) : (
            <div className="fav" onClick={favSelect}>
              <HeartIcon className="heart" fill={fav ? "red" : "white"} />
            </div>
          )}
        </div>
        {productDetails?.productImage?.length > 1 && (
          <div className="image-carousel">
            {productDetails?.productImage?.map((i: any, ind: number) => {
              return (
                <img
                  key={`product-image-carousel-${ind}`}
                  src={`${url}${i?.mediaPath}`}
                  alt={labelConfig?.image_not_loaded}
                  height={50}
                  className={"preview-image"}
                  onClick={() => {
                    setImageArrInd(ind);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="details-section">
        <div className="info-section">
          <div className="title">
            {productDetails?.title}{" "}
            <span>
              <Image
                src={VegSign}
                alt="Veg"
                height={20}
                style={{ marginBottom: "1rem" }}
              />
            </span>
          </div>
          <div className="subtotal">
            {labelConfig?.inr_code}
            {checkOutDetails?.subTotal +
              checkOutDetails?.additionalValueFlavour +
              checkOutDetails?.additionalValueGourmet +
              ((checkOutDetails?.subTotal +
                checkOutDetails?.additionalValueFlavour +
                checkOutDetails?.additionalValueGourmet) *
                productConfig?.deliveryCharge) /
                100}
            <span
              style={{
                fontSize: "0.8rem",
                marginLeft: "1rem",
                color: "red",
              }}
            >
              Inclusive of all taxes
            </span>
          </div>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: productDetails?.description }}
          />
          <div className="customise">
            <div className="section">
              <div className="label">{labelConfig?.product_weight_label}</div>
              <div className="available-options">
                {productDetails?.weight
                  ?.sort((a: any, b: any) => {
                    return a?.value - b?.value;
                  })
                  ?.map((i: any, idx: number) => (
                    <div
                      id={`product-weight-${idx}`}
                      className={`options ${
                        idx === 0 ? "selected-option" : ""
                      }`}
                      key={`weight-${idx}`}
                      onClick={() => {
                        selectWeight(i, idx);
                      }}
                    >
                      {weightConverter(i?.label)}
                      <div className="variant-price">
                        {labelConfig?.inr_code}
                        {i?.value}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="section">
              <div className="label">
                {labelConfig?.product_delivery_pin_availibility}
                <span style={{ color: "red" }}> *</span>
              </div>
              <input
                id="check-pin"
                type={"number"}
                placeholder="Check pin code"
                className="check-pin"
                value={checkOutDetails?.pin}
                onChange={checkPin}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {err?.available && (
              <div className="error">Unavailable at this pincode</div>
            )}
            <div style={{display:'flex', gap:'3rem'}}>
            {/* delivery date and time */}
            <div className="section">
              <div className="label">
                {labelConfig?.product_delivery_date_label}
              </div>
              <div className="calendar-section">
                {calendarOpen ? (
                  <>
                    <Calendar
                      onChange={(e: any) => {
                        setCheckOutDetails((prev: any) => {
                          return {
                            ...prev,
                            deliveryDate: e,
                          };
                        });
                        setCalendarOpen(false);
                      }}
                      minDate={productDetails?.sameDay ? today : minDate}
                      maxDate={maxDate}
                      value={checkOutDetails?.deliveryDate}
                      className="calendar"
                    />
                    <i
                      className="fa-solid fa-xmark cross"
                      onClick={() => {
                        setCalendarOpen(false);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      {checkOutDetails?.deliveryDate.toDateString()}
                      {productDetails?.sameDay && (
                        <>
                          <span style={{ color: "green", marginLeft: "1rem" }}>
                            (Same day delivery available)
                          </span>
                          <span style={{ color: "red" }}> *</span>
                        </>
                      )}
                    </div>
                    <button
                      className="calendar-popup"
                      onClick={() => {
                        setCalendarOpen(true);
                      }}
                    >
                      Select date
                    </button>
                  </>
                )}
              </div>
            </div>
            {checkOutDetails.deliveryDate.toString().split(' ',4)[2] === today.toString().split(' ',4)[2] ? null : <div className="section">
              <div className="label">
                {labelConfig?.product_delivery_time_label}
                <span style={{ color: "red" }}> *</span>
              </div>
              <div className="time-section">
                <Select
                  className="time-picker"
                  isSearchable={false}
                  placeholder={"Select delivery time"}
                  defaultValue={checkOutDetails?.deliveryTime}
                  onChange={(e: any) => {
                    setErr((prev: any) => {
                      return { ...prev, time: false };
                    });
                    setCheckOutDetails((prev: any) => {
                      return { ...prev, deliveryTime: e?.value };
                    });
                  }}
                  options={serverConfig?.del_time_arr}
                />
              </div>
            </div>
            }
            {err?.time && (
              <div className="error">Please select a delivery time</div>
            )}
            </div>
            <div className="section">
              <div className="label">
                {labelConfig?.product_available_flavours_label}
              </div>
              {productDetails?.availableFlavours?.length > 0 ? (
                <div className="available-options">
                  {productDetails?.availableFlavours
                    ?.sort((a: any, b: any) => {
                      return a?.value - b?.value;
                    })
                    ?.map((i: any, idx: number) => (
                      <div
                        id={`product-flavour-${idx}`}
                        className={`options ${
                          idx === 0 ? "selected-option" : ""
                        }`}
                        key={`flavour-${idx}`}
                        onClick={() => {
                          selectFlavour(i, idx);
                        }}
                      >
                        {i?.flavour}
                        {i?.value !== 0 && (
                          <div className="variant-price">
                            {labelConfig?.inr_code}
                            {i?.value}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="no-option">
                  {labelConfig?.product_no_flavours_label}
                </div>
              )}
            </div>

            <div className="section">
              <div className="label">{labelConfig?.product_message_label}</div>
              <div className="text-section">
                <textarea
                  value={checkOutDetails?.message}
                  className="text"
                  onChange={messageOnCake}
                  placeholder={labelConfig?.product_message_placeholder}
                />
                <div className="text-limit">
                  {textFieldLimits?.messageLimit}/
                  {productConfig?.messageFieldLimit}
                </div>
              </div>
            </div>
            <div className="section">
              <div className="label">{labelConfig?.product_custom_label}</div>
              <div className="text-section">
                <textarea
                  value={checkOutDetails?.customization}
                  className="text"
                  onChange={custom}
                  placeholder={labelConfig?.product_custom_placeholder}
                />
                <div className="text-limit">
                  {textFieldLimits?.customLimit}/
                  {productConfig?.customFieldLimit}
                </div>
              </div>
            </div>
            <div className="section">
              <div className="label">{labelConfig?.product_allergy_label}</div>
              <div className="text-section">
                <textarea
                  value={checkOutDetails?.allergy}
                  className="text"
                  onChange={allergyText}
                  placeholder={labelConfig?.product_allergy_placeholder}
                />
                <div className="text-limit">
                  {textFieldLimits?.allergyLimit}/
                  {productConfig?.allergyFieldLimit}
                </div>
              </div>
            </div>
            <div className="section">
              <div className="label">{labelConfig?.product_gourmet_label}</div>
              {productDetails?.gourmetOptions?.length > 0 ? (
                <div className="available-options">
                  {productDetails?.gourmetOptions?.map(
                    (i: any, idx: number) => (
                      <div
                        id={`product-gourmet-${idx}`}
                        className="options"
                        key={`gourmet-${idx}`}
                        onClick={() => {
                          selectGourmet(i, idx);
                        }}
                      >
                        {i?.option}
                        {i?.value !== 0 && (
                          <div className="variant-price">
                            {labelConfig?.inr_code}
                            {i?.value}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="no-option">
                  {labelConfig?.product_no_gourmet_label}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="button-section">
          <button
            className="action-button add-cart"
            type="button"
            onClick={addToCart}
            disabled={loader?.cart}
          >
            {loader?.cart ? (
              <Loading className="dot-flashing" />
            ) : (
              labelConfig?.product_add_to_cart
            )}
          </button>
          <button
            className="action-button buy-now"
            type="button"
            onClick={placeOrder}
            disabled={loader?.buy}
          >
            {loader?.buy ? (
              <Loading className="dot-flashing" />
            ) : (
              labelConfig?.product_buy_now
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
