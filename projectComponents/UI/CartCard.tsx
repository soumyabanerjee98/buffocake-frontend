import Image from "next/image";
import React, { useState } from "react";
import Loading from "./Loading";
import NoImage from "../Assets/Images/no-image.png";
import {
  labelConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import { processIDs } from "../../config/processID";
import { responseType } from "../../typings";
import { messageService } from "../Functions/messageService";

export type CartCardProps = {
  cart: any;
  setCart: any;
};

const CartCard = (props: CartCardProps) => {
  const { cart, setCart } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const [loading, setLoading] = useState(false);
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
  return (
    <>
      <div className="image-container">
        {cart?.productImage ? (
          <img
            src={`${url}${cart?.productImage}`}
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
        <div className="name">{cart?.productName}</div>
        <div className="section">
          <div className="title">Qty: </div>
          <div className="value">{cart?.qty}</div>
        </div>
        <div className="section">
          <div className="title">Weight: </div>
          <div className="value">{cart?.weight} lbs</div>
        </div>
        <div className="section">
          <div className="title">Flavour: </div>
          <div className="value">{cart?.flavour ? cart?.flavour : "NA"}</div>
        </div>
        <div className="section">
          <div className="title">Customization: </div>
          <div className="value">{cart?.custom ? cart?.custom : "NA"}</div>
        </div>
        <div className="section">
          <div className="title">Message on cake: </div>
          <div className="value">{cart?.message ? cart?.message : "NA"}</div>
        </div>
        <div className="section">
          <div className="title">Allergies: </div>
          <div className="value">{cart?.allergy ? cart?.allergy : "NA"}</div>
        </div>
        <div className="section">
          <div className="title">Delivery Date: </div>
          <div className="value">{cart?.delDate}</div>
        </div>
        <div className="section">
          <div className="title">Delivery Time: </div>
          <div className="value">{cart?.delTime}</div>
        </div>
        <div className="section total">
          {labelConfig?.inr_code} {cart?.subTotal}
        </div>
      </div>
      <div className="remove-button">
        <button
          type="button"
          className="remove"
          onClick={() => {
            removeItem(cart?._id);
          }}
        >
          {loading ? <Loading className="dot-flashing" /> : "Remove"}
        </button>
      </div>
    </>
  );
};

export default CartCard;
