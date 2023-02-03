import Image from "next/image";
import useSwr from "swr";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import {
  labelConfig,
  productConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import NoIMage from "../Assets/Images/no-image.png";
import { callApi, getSessionObjectData } from "../Functions/util";
import HeartIcon from "../UI/Icons/HeartIcon";
import { messageService } from "../Functions/messageService";

export type ProductProps = {
  productDetails: any;
};

const getLocalDateTime = () => {
  const d = new Date();
  const today = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, -1);
  return today.split(":")[0]?.concat(`:${today.split(":")[1]}`);
};

const Products = (props: ProductProps) => {
  const { productDetails } = props;
  const wishlistFetcher = async () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      let data = await callApi(processIDs?.get_wishlist, {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      }).then((res: any) => {
        if (res?.data?.returnCode) {
          let returnStatement;
          if (res?.data?.returnData) {
            returnStatement = res?.data?.returnData?.includes(
              productDetails?._id
            );
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
    wishlistFetcher,
    { refreshInterval: 1 }
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
    deliveryTime: "",
  });
  const [textFieldLimits, setTextFieldLimits] = useState({
    messageLimit: productConfig?.messageFieldLimit,
    allergyLimit: productConfig?.allergyFieldLimit,
  });
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;

  useEffect(() => {
    setFav(favourite);
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

  const setDeliveryDateTime = (datetime: string) => {
    let mintime = getLocalDateTime()
      .split("T")[1]
      .split(":")[0]
      .concat(getLocalDateTime().split("T")[1].split(":")[1]);
    let selectedTime = datetime
      .split("T")[1]
      .split(":")[0]
      .concat(datetime.split("T")[1].split(":")[1]);
    let mindate = getLocalDateTime().split("T")[0];
    if (mindate === datetime.split("T")[0]) {
      if (parseInt(selectedTime) > parseInt(mintime)) {
        setCheckOutDetails((prev: any) => {
          return { ...prev, deliveryTime: datetime };
        });
      }
    }
  };

  const favSelect = () => {
    if (getSessionObjectData(storageConfig?.userProfile)) {
      if (fav) {
        callApi(processIDs?.remove_item_from_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          itemId: productDetails?._id,
        }).then((res: any) => {
          if (res?.data?.returnCode) {
            setFav(false);
          }
        });
      } else {
        callApi(processIDs?.add_item_to_wishlist, {
          userId: getSessionObjectData(storageConfig?.userProfile)?.id,
          itemId: productDetails?._id,
        }).then((res: any) => {
          if (res?.data?.returnCode) {
            setFav(true);
          }
        });
      }
    } else {
      loginCardOpen();
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
        {!isLoading && (
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
              <div className="label">{labelConfig?.product_delivery_label}</div>
              <input
                type={"datetime-local"}
                min={getLocalDateTime()}
                value={checkOutDetails?.deliveryTime}
                onChange={(e: any) => {
                  setDeliveryDateTime(e.target.value);
                }}
              />
            </div>
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
          <button className="action-button add-cart" type="button">
            {labelConfig?.product_add_to_cart}
          </button>
          <button className="action-button buy-now" type="button">
            {labelConfig?.product_buy_now}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
