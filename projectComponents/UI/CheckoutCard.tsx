import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { paytmConfig } from "../../config/secret";
import { labelConfig, storageConfig } from "../../config/siteConfig";
import { messageType, responseType } from "../../typings";
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
  const [address, setAddress] = useState<any>();
  const [addressInd, setAddressInd] = useState(0);
  const [grandTotal, setGrandTotal] = useState<any>(null);

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
  const AddAddress = () => {
    messageService?.sendMessage(
      "checkout-card",
      // @ts-ignore
      {
        action: "add-address",
        params: {
          name: `${
            getSessionObjectData(storageConfig?.userProfile)?.firstName
          } ${getSessionObjectData(storageConfig?.userProfile)?.lastName}`,
          contact: `${
            getSessionObjectData(storageConfig?.userProfile)?.phoneNumber
          }`,
          fav: true,
        },
      },
      "global"
    );
  };

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.address)) {
      let addressArr = [];
      let favItem = getSessionObjectData(storageConfig?.address)?.find(
        (i: any) => {
          return i?.favorite === true;
        }
      );
      if (favItem) {
        addressArr.push(favItem);
      }
      let otherItems = getSessionObjectData(storageConfig?.address)?.filter(
        (i: any) => {
          return i?.favorite === false;
        }
      );
      otherItems.map((i: any) => {
        addressArr.push(i);
      });
      setAddress(addressArr);
    }
    callApi(processIDs?.get_address, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (res?.data?.returnData) {
              let addressArr = [];
              let favItem = res?.data?.returnData?.find((i: any) => {
                return i?.favorite === true;
              });
              if (favItem) {
                addressArr.push(favItem);
              }
              let otherItems = res?.data?.returnData?.filter((i: any) => {
                return i?.favorite === false;
              });
              otherItems.map((i: any) => {
                addressArr.push(i);
              });
              setAddress(addressArr);
              setSessionObjectData(
                storageConfig?.address,
                res?.data?.returnData
              );
            } else {
              setAddress([]);
              setSessionObjectData(storageConfig?.address, []);
            }
          } else {
            setAddress([]);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setAddress(undefined);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
        setAddress(undefined);
      });
    // @ts-ignore
    messageService?.onReceive()?.subscribe((m: messageType) => {
      if (m?.sender === "address-card") {
        if (m?.message?.action === "address-update") {
          setAddress(m?.message?.params);
        }
      }
    });
  }, []);
  useEffect(() => {
    let total = 0;
    cart?.map((i: any) => {
      total = total + i?.subTotal;
    });
    setGrandTotal(total);
  }, []);

  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="checkout-card">
        <div className="checkout-details">
          <div className="left-column">
            <div className="title">Address</div>
            <div
              className={`details ${
                address?.length === 0 ? "no-address" : "address"
              }`}
            >
              {address === undefined && <>Loading...</>}
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
                  <div className="go-to-profile" onClick={AddAddress}>
                    Add address
                  </div>
                </div>
              )}
              {address?.length > 0 && (
                <>
                  <div className={`${addressInd === 0 ? "space" : ""}`}>
                    {address?.length > 1 && addressInd > 0 && (
                      <i
                        className="fa-solid fa-arrow-left arrows"
                        onClick={() => {
                          setAddressInd((prev) => prev - 1);
                        }}
                      />
                    )}
                  </div>
                  <div className="address-item">
                    <div className="address-title">
                      {address?.[addressInd]?.receiverName}
                    </div>
                    <div className="address-details">
                      <div className="address-section">
                        <div className="label">House / Building : </div>
                        <div className="value">
                          {address?.[addressInd]?.house
                            ? address?.[addressInd]?.house
                            : "N/A"}
                        </div>
                      </div>
                      <div className="address-section">
                        <div className="label">Street no. : </div>
                        <div className="value">
                          {address?.[addressInd]?.street}
                        </div>
                      </div>
                      <div className="address-section">
                        <div className="label">Pin code : </div>
                        <div className="value">
                          {address?.[addressInd]?.pin}
                        </div>
                      </div>
                    </div>
                    <div className="address-contact">
                      {address?.[addressInd]?.receiverContact}
                    </div>
                  </div>
                  <div
                    className={`${
                      address?.length === addressInd + 1 ? "space" : ""
                    }`}
                  >
                    {address?.length - 1 > addressInd &&
                      address?.length > 1 && (
                        <i
                          className="fa-solid fa-arrow-right arrows"
                          onClick={() => {
                            setAddressInd((prev) => prev + 1);
                          }}
                        />
                      )}
                  </div>
                </>
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
                      <div className="label">Weight: </div>
                      <div className="value">
                        {i?.weight} {labelConfig?.product_weight_unit}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Flavour: </div>
                      <div className="value">
                        {i?.flavour ? i?.flavour : "N/A"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Customization: </div>
                      <div className="value">
                        {i?.custom ? i?.custom : "N/A"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Message on cake: </div>
                      <div className="value">
                        {i?.message ? i?.message : "N/A"}
                      </div>
                    </div>
                    <div className="section">
                      <div className="label">Allergies: </div>
                      <div className="value">
                        {i?.allergy ? i?.allergy : "N/A"}
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
          disable={address?.length > 0 ? false : true}
          Address={address?.[addressInd]}
          cart={cart}
          source={source}
        />
      </div>
    </div>
  );
};

export default CheckoutCard;
