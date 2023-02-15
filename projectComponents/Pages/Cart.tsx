import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../config/processID";
import {
  labelConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import { responseType } from "../../typings";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import NoImage from "../Assets/Images/no-image.png";
import { useRouter } from "next/router";
import Loading from "../UI/Loading";
import { messageService } from "../Functions/messageService";

const Cart = () => {
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const dataFetcher = async () => {
    let data = await callApi(processIDs?.get_cart, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }).then((res: responseType) => {
      if (res?.data?.returnCode) {
        if (res?.data?.returnData) {
          return res?.data?.returnData;
        } else {
          return [];
        }
      } else {
        return [];
      }
    });
    return data;
  };
  const {
    data: cartData,
    isLoading,
    error,
  } = useSwr(`${processIDs?.get_cart}`, dataFetcher, {
    refreshInterval: 1,
  });
  const [cart, setCart] = useState(cartData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigate = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.cart)) {
      setCart(getSessionObjectData(storageConfig?.cart));
    } else {
      if (cartData?.length > 0) {
        setSessionObjectData(storageConfig?.cart, cartData);
      }
      setCart(cartData);
    }
  }, [cartData]);
  const removeItem = (id: string) => {
    setLoading(true);
    callApi(processIDs?.remove_item_from_cart, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      cartId: id,
    }).then((res: responseType) => {
      if (res?.data?.returnCode) {
        setLoading(false);
        setCart(res?.data?.returnData);
        setSessionObjectData(storageConfig?.cart, res?.data?.returnData);
        messageService?.sendMessage(
          "cart-page",
          // @ts-ignore
          {
            action: "refresh-count",
            params: res?.data?.returnData?.length,
          },
          "cart-icon"
        );
      }
    });
  };
  if (isLoading) return <>Loading...</>;
  if (cart?.length === 0) {
    return (
      <div className="no-cart">
        <Image src={Broken} alt="Broken" height={100} priority={true} />
        <div>No product found</div>
        <div className="buy">Buy products</div>
      </div>
    );
  }
  return (
    <div className="cart-screen">
      <div className="header">Your Cart</div>
      <div className="cart">
        {cart?.map((i: any, idx: number) => {
          return (
            <div
              key={`cart-item-${idx}`}
              className="cart-item"
              onClick={(e: any) => {
                if (e.target.nodeName !== "BUTTON") {
                  navigate(`product/${i?.productId}`);
                }
              }}
            >
              <div className="image-container">
                {i?.productImage ? (
                  <img
                    src={`${url}${i?.productImage}`}
                    className="image"
                    alt="Image not found!"
                  />
                ) : (
                  <Image
                    src={NoImage}
                    alt="Image not found!"
                    priority={true}
                    className="image"
                  />
                )}
              </div>
              <div className="details">
                <div className="section">
                  <div className="title">Qty: </div>
                  <div className="value">{i?.qty}</div>
                </div>
                <div className="section">
                  <div className="title">Weight: </div>
                  <div className="value">{i?.weight} lbs</div>
                </div>
                <div className="section">
                  <div className="title">Flavour: </div>
                  <div className="value">{i?.flavour ? i?.flavour : "NA"}</div>
                </div>
                <div className="section">
                  <div className="title">Customization: </div>
                  <div className="value">{i?.custom ? i?.custom : "NA"}</div>
                </div>
                <div className="section">
                  <div className="title">Message on cake: </div>
                  <div className="value">{i?.message ? i?.message : "NA"}</div>
                </div>
                <div className="section">
                  <div className="title">Allergies: </div>
                  <div className="value">{i?.allergy ? i?.allergy : "NA"}</div>
                </div>
                <div className="section">
                  <div className="title">Delivery Date: </div>
                  <div className="value">{i?.delDate}</div>
                </div>
                <div className="section">
                  <div className="title">Delivery Time: </div>
                  <div className="value">{i?.delTime}</div>
                </div>
                <div className="section total">
                  {labelConfig?.inr_code} {i?.subTotal}
                </div>
              </div>
              <div className="remove-button">
                <button
                  type="button"
                  className="remove"
                  onClick={() => {
                    removeItem(i?._id);
                  }}
                >
                  {loading ? <Loading className="dot-flashing" /> : "Remove"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
