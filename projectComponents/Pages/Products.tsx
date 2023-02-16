import Image from "next/image";
import useSwr from "swr";
import React, { useEffect, useState } from "react";
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
} from "../Functions/util";
import HeartIcon from "../UI/Icons/HeartIcon";
import { messageService } from "../Functions/messageService";
import { responseType } from "../../typings";
import Loading from "../UI/Loading";

export type ProductProps = {
  productDetails: any;
};

const Products = (props: ProductProps) => {
  const { productDetails } = props;
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 8);
  minDate.setDate(minDate.getDate() + 1);
  const wishlistFetcher = async () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      let data = await callApi(processIDs?.get_wishlist, {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          let returnStatement;
          if (res?.data?.returnData) {
            if (getSessionObjectData(storageConfig?.wishlist) === null) {
              setSessionObjectData(
                storageConfig?.wishlist,
                res?.data?.returnData
              );
            }
            let data = res?.data?.returnData?.find((i: any) => {
              return i?.productId === productDetails?._id;
            });
            if (data) {
              returnStatement = true;
            } else {
              returnStatement = false;
            }
          } else {
            returnStatement = false;
          }
          return returnStatement;
        } else {
          return false;
        }
      });
      return data;
    } else {
      return undefined;
    }
  };
  const {
    data: favourite,
    error,
    isLoading,
  } = useSwr(
    `${processIDs?.get_wishlist}${productDetails?._id}`,
    wishlistFetcher
  );
  const [fav, setFav] = useState(favourite);
  const [checkOutDetails, setCheckOutDetails] = useState({
    qty: 1,
    weight: productDetails?.minWeight,
    subTotal: productDetails?.unitValue,
    additionalValueFlavour: 0,
    additionalValueCustom: 0,
    selectedFlavour: null,
    message: "",
    customOption: null,
    allergy: "",
    deliveryDate: minDate,
    deliveryTime: null,
  });
  const [err, setErr] = useState({
    flavours: false,
    time: false,
  });
  const [loader, setLoader] = useState({
    buy: false,
    cart: false,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [textFieldLimits, setTextFieldLimits] = useState({
    messageLimit: productConfig?.messageFieldLimit,
    allergyLimit: productConfig?.allergyFieldLimit,
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
    } else {
      setFav(favourite);
    }
  }, [favourite]);

  const loginCardOpen = () => {
    messageService?.sendMessage(
      "product-page",
      // @ts-ignore
      { action: "login-popup" },
      "header"
    );
  };

  const changeQty = (action: string) => {
    switch (action) {
      case "add":
        setCheckOutDetails((prev: any) => {
          return {
            ...prev,
            qty: prev?.qty + productConfig?.qtyAdjustUnit,
            subTotal:
              productDetails?.unitValue *
              prev?.weight *
              (prev?.qty + productConfig?.qtyAdjustUnit),
          };
        });
        break;
      case "deduct":
        setCheckOutDetails((prev: any) => {
          return {
            ...prev,
            qty: prev?.qty - productConfig?.qtyAdjustUnit,
            subTotal:
              productDetails?.unitValue *
              prev?.weight *
              (prev?.qty - productConfig?.qtyAdjustUnit),
          };
        });
        break;
      default:
        break;
    }
  };

  const changeWeight = (action: string) => {
    switch (action) {
      case "add":
        setCheckOutDetails((prev: any) => {
          return {
            ...prev,
            weight: prev?.weight + productConfig?.weightAdjustUnit,
            subTotal:
              productDetails?.unitValue *
              (prev?.weight + productConfig?.weightAdjustUnit) *
              prev?.qty,
          };
        });
        break;
      case "deduct":
        setCheckOutDetails((prev: any) => {
          return {
            ...prev,
            weight: prev?.weight - productConfig?.weightAdjustUnit,
            subTotal:
              productDetails?.unitValue *
              (prev?.weight - productConfig?.weightAdjustUnit) *
              prev?.qty,
          };
        });
        break;
      default:
        break;
    }
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

  const selectCustom = (opt: any, index: number) => {
    let element = document.getElementById(`product-custom-${index}`);
    if (element?.className.includes("selected-option")) {
      productDetails?.customOptions?.map((i: any, idx: number) => {
        let element = document.getElementById(`product-custom-${idx}`);
        element?.classList.remove("selected-option");
      });
      setCheckOutDetails((prev: any) => {
        return {
          ...prev,
          customOption: null,
          additionalValueCustom: 0,
        };
      });
    } else {
      productDetails?.customOptions?.map((i: any, idx: number) => {
        let element = document.getElementById(`product-custom-${idx}`);
        element?.classList.remove("selected-option");
      });
      element?.classList.add("selected-option");
      setCheckOutDetails((prev: any) => {
        return {
          ...prev,
          customOption: opt?.option,
          additionalValueCustom: opt?.value,
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
      if (fav) {
        callApi(processIDs?.remove_item_from_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          productId: productDetails?._id,
        }).then((res: responseType) => {
          if (res?.data?.returnCode) {
            setFav(false);
            setSessionObjectData(
              storageConfig?.wishlist,
              res?.data?.returnData
            );
          }
        });
      } else {
        callApi(processIDs?.add_item_to_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          productId: productDetails?._id,
        }).then((res: responseType) => {
          if (res?.data?.returnCode) {
            setFav(true);
            setSessionObjectData(
              storageConfig?.wishlist,
              res?.data?.returnData
            );
          }
        });
      }
    } else {
      loginCardOpen();
    }
  };

  const addToCart = () => {
    if (
      productDetails?.availableFlavours?.length > 0 &&
      checkOutDetails?.selectedFlavour === null
    ) {
      setErr((prev: any) => {
        return { ...prev, flavours: true };
      });
    } else if (!checkOutDetails?.deliveryTime) {
      setErr((prev: any) => {
        return { ...prev, time: true };
      });
    } else {
      setLoader((prev: any) => {
        return { ...prev, cart: true };
      });
      let body = {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
        productId: productDetails?._id,
        qty: checkOutDetails?.qty,
        weight: checkOutDetails?.weight,
        flavour: checkOutDetails?.selectedFlavour
          ? checkOutDetails?.selectedFlavour
          : "",
        custom: checkOutDetails?.customOption
          ? checkOutDetails?.customOption
          : "",
        message: checkOutDetails?.message,
        allergy: checkOutDetails?.allergy,
        delDate: checkOutDetails?.deliveryDate?.toDateString(),
        delTime: checkOutDetails?.deliveryTime,
        subTotal:
          checkOutDetails?.additionalValueCustom +
          checkOutDetails?.additionalValueFlavour +
          checkOutDetails?.subTotal,
      };
      callApi(processIDs?.add_item_to_cart, body).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setLoader((prev: any) => {
            return { ...prev, cart: false };
          });
          setSessionObjectData(storageConfig?.cart, res?.data?.returnData);
          messageService?.sendMessage(
            "product-page",
            // @ts-ignore
            {
              action: "refresh-count",
              params: res?.data?.returnData?.length,
            },
            "cart-icon"
          );
        }
      });
    }
  };

  const placeOrder = () => {
    if (
      productDetails?.availableFlavours?.length > 0 &&
      checkOutDetails?.selectedFlavour === null
    ) {
      setErr((prev: any) => {
        return { ...prev, flavours: true };
      });
    } else if (!checkOutDetails?.deliveryTime) {
      setErr((prev: any) => {
        return { ...prev, time: true };
      });
    } else {
      let body = {
        productId: productDetails?._id,
        productName: productDetails?.title,
        qty: checkOutDetails?.qty,
        weight: checkOutDetails?.weight,
        flavour: checkOutDetails?.selectedFlavour
          ? checkOutDetails?.selectedFlavour
          : "",
        custom: checkOutDetails?.customOption
          ? checkOutDetails?.customOption
          : "",
        message: checkOutDetails?.message,
        allergy: checkOutDetails?.allergy,
        delDate: checkOutDetails?.deliveryDate?.toDateString(),
        delTime: checkOutDetails?.deliveryTime,
        subTotal:
          checkOutDetails?.additionalValueCustom +
          checkOutDetails?.additionalValueFlavour +
          checkOutDetails?.subTotal,
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
  };

  return (
    <div className="product-screen">
      <div className="image-section">
        {productDetails?.productImage ? (
          <img
            src={`${url}${productDetails?.productImage}`}
            alt={labelConfig?.image_not_loaded}
            className="product-image"
          />
        ) : (
          <Image
            src={NoIMage}
            alt={labelConfig?.image_not_loaded}
            className="product-image"
          />
        )}
        {isLoading ? (
          <div className="fav-loader">
            <Loading className="spinner" />
          </div>
        ) : (
          <div className="fav" onClick={favSelect}>
            <HeartIcon className="heart" fill={fav ? "red" : "white"} />
          </div>
        )}
      </div>
      <div className="details-section">
        <div className="info-section">
          <div className="title">{productDetails?.title}</div>
          <div className="customise">
            <div className="section">
              <div className="label">{labelConfig?.product_qty_label}</div>
              <button
                disabled={checkOutDetails?.qty === 1}
                type="button"
                className={checkOutDetails?.qty === 1 ? "" : "section-button"}
                onClick={() => {
                  changeQty("deduct");
                }}
              >
                {labelConfig?.product_unit_deduct}
              </button>
              <div>{checkOutDetails?.qty}</div>
              <button
                type="button"
                className="section-button"
                onClick={() => {
                  changeQty("add");
                }}
              >
                {labelConfig?.product_unit_add}
              </button>
            </div>
            <div className="section">
              <div className="label">{labelConfig?.product_weight_label}</div>
              <button
                disabled={checkOutDetails?.weight === productDetails?.minWeight}
                type="button"
                className={
                  checkOutDetails?.weight === productDetails?.minWeight
                    ? ""
                    : "section-button"
                }
                onClick={() => {
                  changeWeight("deduct");
                }}
              >
                {labelConfig?.product_unit_deduct}
              </button>
              <div>
                {checkOutDetails?.weight} {labelConfig?.product_weight_unit}
              </div>
              <button
                type="button"
                className="section-button"
                onClick={() => {
                  changeWeight("add");
                }}
              >
                {labelConfig?.product_unit_add}
              </button>
            </div>
            <div className="section">
              <div className="label">
                {labelConfig?.product_available_flavours_label}
                {productDetails?.availableFlavours?.length > 0 && (
                  <span style={{ color: "red" }}> *</span>
                )}
              </div>
              {productDetails?.availableFlavours?.length > 0 ? (
                <div className="available-options">
                  {productDetails?.availableFlavours?.map(
                    (i: any, idx: number) => (
                      <div
                        id={`product-flavour-${idx}`}
                        className="options"
                        key={`flavour-${idx}`}
                        onClick={() => {
                          selectFlavour(i, idx);
                        }}
                      >
                        {i?.flavour}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="no-option">
                  {labelConfig?.product_no_flavours_label}
                </div>
              )}
            </div>
            {err?.flavours && (
              <div className="error">Please select a flavour</div>
            )}
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
              <div className="label">
                {labelConfig?.product_available_custom_label}
              </div>
              {productDetails?.customOptions?.length > 0 ? (
                <div className="available-options">
                  {productDetails?.customOptions?.map((i: any, idx: number) => (
                    <div
                      id={`product-custom-${idx}`}
                      className="options"
                      key={`custom-${idx}`}
                      onClick={() => {
                        selectCustom(i, idx);
                      }}
                    >
                      {i?.option}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-option">
                  {labelConfig?.product_no_custom_label}
                </div>
              )}
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
                      minDate={minDate}
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
                    <div>{checkOutDetails?.deliveryDate.toDateString()}</div>
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
            <div className="section">
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
            {err?.time && (
              <div className="error">Please select a delivery time</div>
            )}
          </div>
          <div className="subtotal">
            {labelConfig?.inr_code}
            {checkOutDetails?.subTotal +
              checkOutDetails?.additionalValueFlavour +
              checkOutDetails?.additionalValueCustom}
          </div>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: productDetails?.description }}
          />
        </div>
        <div className="button-section">
          <button
            className="action-button add-cart"
            type="button"
            onClick={addToCart}
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
