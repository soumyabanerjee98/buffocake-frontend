import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../config/processID";
import { paytmConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import { messageService } from "../Functions/messageService";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import PaytmPayment from "./PaytmPayment";

export type CheckoutCardProps = {
  source: string;
  cart: any;
};

const CheckoutCard = (props: CheckoutCardProps) => {
  const { source, cart } = props;
  //   console.log(source, cart);
  const router = useRouter();
  const dataFetcher = async () => {
    if (getSessionObjectData(storageConfig?.address)) {
      return getSessionObjectData(storageConfig?.address);
    } else {
      let data = await callApi(processIDs?.get_address, {
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
    }
  };
  const {
    data: addressData,
    error,
    isLoading,
  } = useSwr(processIDs?.get_address, dataFetcher);
  const [address, setAddress] = useState(addressData);
  const [grandTotal, setGrandTotal] = useState<any>(null);
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.address)) {
      setAddress(getSessionObjectData(storageConfig?.address));
    } else {
      setAddress(addressData);
      if (addressData?.length > 0) {
        setSessionObjectData(storageConfig?.address, addressData);
      }
    }
  }, [addressData]);
  useEffect(() => {
    let total = 0;
    cart?.map((i: any) => {
      total = total + i?.subTotal;
    });
    setGrandTotal(total);
  }, []);
  const closePopUp = () => {
    messageService?.sendMessage(
      "checkout-card",
      // @ts-ignore
      { action: "close-popup" },
      "header"
    );
  };
  const clickOutSide = (e: any) => {
    if (e.target.className === "modal") {
      closePopUp();
    }
  };
  const goToProfile = () => {
    closePopUp();
    router.push("/profile");
  };
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="checkout-card">
        <div className="checkout-details">
          <div className="left-column">
            <div className="title">Address</div>
            <div
              className={`details ${address?.length === 0 ? "no-address" : ""}`}
            >
              {address?.length === 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ paddingBottom: "1rem" }}>No address found!</div>
                  <div className="go-to-profile" onClick={goToProfile}>
                    Go to profile
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="right-column">
            <div className="title">Items</div>
            <div className="details">
              {cart?.map((i: any, idx: number) => {
                return (
                  <div key={`item-${idx}`} className="items">
                    <div className="name">{i?.productName}</div>
                    <div className="section">
                      <div className="label">Qty: </div>
                      <div className="value">{i?.qty}</div>
                    </div>
                    <div className="section">
                      <div className="label">Weight: </div>
                      <div className="value">{i?.weight} lbs</div>
                    </div>
                    <div className="section">
                      <div className="label">Flavour: </div>
                      <div className="value">
                        {i?.flavour ? i?.flavour : "NA"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Customization: </div>
                      <div className="value">
                        {i?.custom ? i?.custom : "NA"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Message on cake: </div>
                      <div className="value">
                        {i?.message ? i?.message : "NA"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Allergies: </div>
                      <div className="value">
                        {i?.allergy ? i?.allergy : "NA"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Delivery Date: </div>
                      <div className="value">{i?.delDate}</div>
                    </div>
                    <div className="section">
                      <div className="label">Delivery Time: </div>
                      <div className="value">{i?.delTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <PaytmPayment
          MID={
            process.env.NODE_ENV === "production"
              ? paytmConfig?.mid
              : paytmConfig?.stage_mid
          }
          MKEY={
            process.env.NODE_ENV === "production"
              ? paytmConfig?.mkey
              : paytmConfig?.stage_mkey
          }
          Total={grandTotal}
          disable={addressData?.length > 0 ? false : true}
        />
      </div>
    </div>
  );
};

export default CheckoutCard;
