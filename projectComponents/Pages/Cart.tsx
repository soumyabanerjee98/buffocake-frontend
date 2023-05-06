import Image from "next/image";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import { labelConfig, storageConfig } from "../../config/siteConfig";
import { messageType, responseType } from "../../typings";
import {
  callApi,
  getSessionObjectData,
  metaUrlGenerate,
  openTab,
  setSessionObjectData,
} from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import { useRouter } from "next/router";
import { messageService } from "../Functions/messageService";
import CartCard from "../UI/CartCard";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState<any>();
  const [grandTotal, setGrandTotal] = useState<any>(null);
  const router = useRouter();
  const navigate = (url: string) => {
    router.push(url);
  };

  const checkOut = () => {
    messageService?.sendMessage(
      "cart-page",
      // @ts-ignore
      {
        action: "checkout",
        params: cart,
      },
      "checkout-card"
    );
  };

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.cart)) {
      setCart(getSessionObjectData(storageConfig?.cart));
    }
    callApi(processIDs?.get_cart, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (res?.data?.returnData) {
              setSessionObjectData(storageConfig?.cart, res?.data?.returnData);
              setCart(res?.data?.returnData);
            } else {
              setSessionObjectData(storageConfig?.cart, []);
              setCart([]);
            }
          } else {
            setCart([]);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setCart(undefined);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
        setCart(undefined);
      });
    // @ts-ignore
    messageService?.onReceive()?.subscribe((m: messageType) => {
      if (m?.sender == "checkout-card" && m?.target === "global") {
        if (m?.message?.action === "clear-cart-payment-successfull") {
          setCart(m?.message?.params?.cart);
        }
      }
    });
  }, []);
  useEffect(() => {
    if (cart) {
      let total = 0;
      cart?.map((i: any) => {
        total = total + i?.subTotal;
      });
      setGrandTotal(total.toFixed(2));
    }
  }, [cart]);
  if (cart === undefined) return <>Loading...</>;
  if (cart?.length === 0 || !cart) {
    return (
      <div className="no-cart">
        <Image src={Broken} alt="Broken" height={100} priority={true} />
        <div>No product found</div>
        <div
          className="buy"
          onClick={() => {
            navigate("/");
          }}
        >
          Buy products
        </div>
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
                  openTab(`/product/${metaUrlGenerate(i?.productMetaTitle)}`);
                }
              }}
            >
              <CartCard cart={i} setCart={setCart} />
            </div>
          );
        })}
      </div>
      <div className="checkout-section" onClick={checkOut}>
        <div>Proceed to checkout</div>
        <div className="total">
          Total: {labelConfig?.inr_code} {grandTotal}
        </div>
      </div>
    </div>
  );
};

export default Cart;
