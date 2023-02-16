import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../../config/processID";
import { labelConfig, storageConfig } from "../../../config/siteConfig";
import { messageType, responseType } from "../../../typings";
import { messageService } from "../../Functions/messageService";
import { callApi, getSessionObjectData } from "../../Functions/util";

export type CartIconProps = {
  fill: string;
  className: string;
  textColor: string;
};

const CartIcon = (props: CartIconProps) => {
  const { fill, className, textColor } = props;
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
  } = useSwr(`${processIDs?.get_cart}`, dataFetcher);
  const [cartCount, setCartCount] = useState(cartData?.length);
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.cart)) {
      setCartCount(getSessionObjectData(storageConfig?.cart)?.length);
    } else {
      setCartCount(cartData?.length);
    }
    // @ts-ignore
    messageService?.onReceive()?.subscribe((m: messageType) => {
      if (
        (m?.sender === "product-page" || m?.sender === "cart-page") &&
        m?.target === "cart-icon"
      ) {
        if (m?.message?.action === "refresh-count") {
          setCartCount(m?.message?.params);
        }
      }
    });
  }, [cartData]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        gap: "4px",
        position: "relative",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        className={className}
      >
        <path
          d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"
          fill={fill}
        />
      </svg>
      <div style={{ color: textColor }}>{labelConfig?.cart_label}</div>
      {cartCount !== 0 && (
        <div
          style={{
            position: "absolute",
            top: "-0.6rem",
            right: "-0.4rem",
            backgroundColor: "rgb(224, 135, 168)",
            height: "1.2rem",
            width: "1.2rem",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {cartCount}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
