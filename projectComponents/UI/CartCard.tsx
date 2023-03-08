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
import { toast } from "react-toastify";

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
    }) // @ts-ignore
      .then((res: responseType) => {
        setLoading(false);
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
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
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        setLoading(false);
        toast.error(`Error: ${err?.message}`);
      });
  };
  return (
    <>
      <div className="image-container">
        {cart?.productImage?.length > 0 ? (
          <img
            src={`${url}${cart?.productImage?.[0]?.mediaPath}`}
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
          <div className="title">Weight: </div>
          <div className="value">{cart?.weight} lbs</div>
        </div>
        <div className="section">
          <div className="title">Flavour: </div>
          {cart?.flavour ? (
            <div className="value">{cart?.flavour}</div>
          ) : (
            <div className="no-value">No flavour selected</div>
          )}
        </div>
        <div className="section">
          <div className="title">Customization: </div>
          {cart?.custom ? (
            <div className="value">{cart?.custom}</div>
          ) : (
            <div className="no-value">No customization</div>
          )}
        </div>
        <div className="section">
          <div className="title">Message on cake: </div>
          {cart?.message ? (
            <div className="value">{cart?.message}</div>
          ) : (
            <div className="no-value">No message</div>
          )}
        </div>
        <div className="section">
          <div className="title">Allergies: </div>
          {cart?.allergy ? (
            <div className="value">{cart?.allergy}</div>
          ) : (
            <div className="no-value">No allergy</div>
          )}
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
          disabled={loading}
        >
          {loading ? <Loading className="dot-flashing" /> : "Remove"}
        </button>
      </div>
    </>
  );
};

export default CartCard;
