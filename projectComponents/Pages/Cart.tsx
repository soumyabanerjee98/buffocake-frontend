import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../config/processID";
import { labelConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import { useRouter } from "next/router";
import { messageService } from "../Functions/messageService";
import CartCard from "../UI/CartCard";

const Cart = () => {
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
  const [cart, setCart] = useState(cartData);
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
    } else {
      if (cartData?.length > 0) {
        setSessionObjectData(storageConfig?.cart, cartData);
      }
      setCart(cartData);
    }
  }, [cartData]);
  useEffect(() => {
    let total = 0;
    cart?.map((i: any) => {
      total = total + i?.subTotal;
    });
    setGrandTotal(total);
  }, [cart]);
  if (isLoading) return <>Loading...</>;
  if (cart?.length === 0 || !cart) {
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
