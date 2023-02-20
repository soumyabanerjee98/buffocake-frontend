import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import {
  labelConfig,
  paytmConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import {
  callApi,
  getLocalObjectData,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import { processIDs } from "../../config/processID";
import Loading from "./Loading";
import { responseType } from "../../typings";
import { toast } from "react-toastify";
import { messageService } from "../Functions/messageService";

export type PaytmPaymentProps = {
  MID: string;
  MKEY: string;
  Total: number;
  disable: boolean;
  Address: any;
  source: any;
  cart: any;
};

const PaytmPayment = (props: PaytmPaymentProps) => {
  const { MID, MKEY, Total, Address, disable, source, cart } = props;
  const [loading, setLoading] = useState(false);
  const env = process.env.NODE_ENV;
  const paytmbaseurl =
    env === "production" ? paytmConfig?.host : paytmConfig?.stage_host;
  const checkoutFunc = (response: any) => {
    let body = {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      oid: response?.orderId,
      txnId: response?.txnId,
      items:
        cart?.length === 1
          ? cart
          : cart?.map((i: any) => {
              return {
                ...i,
                subOrderId: `${response?.orderId}_${Math.floor(
                  Math.random() * Date.now()
                )}`,
              };
            }),
      shippingAddress: response?.address,
      total: response?.total,
      paymentStatus:
        response?.resultInfo?.resultStatus === "TXN_SUCCESS"
          ? "Completed"
          : "Pending",
      orderStatus:
        response?.resultInfo?.resultStatus === "TXN_SUCCESS"
          ? "Accepted"
          : "Pending",
      orderTimeStamp: response?.txnDate,
    };

    callApi(processIDs?.create_order, body) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (getSessionObjectData(storageConfig?.userProfile)?.email) {
              let config = {
                SecureToken: serverConfig?.smtp_creds?.security_token,
                To: getSessionObjectData(storageConfig?.userProfile)?.email,
                From: serverConfig?.smtp_creds?.from,
                Subject: `Order confirmed #${response?.orderId}`,
                Body: `<strong>Hi ${
                  getSessionObjectData(storageConfig?.userProfile)?.firstName
                }, Your Order #${response?.orderId} is confirmed.</strong>`,
              };
              if ((window as any).Email) {
                (window as any).Email.send(config)
                  .then((res: any) => {
                    console.log(res, "email success");
                    setSessionObjectData(
                      storageConfig?.orders,
                      res?.data?.returnData
                    );
                    if (source === "cart-page") {
                      callApi(processIDs?.clear_cart, {
                        userId: getSessionObjectData(storageConfig?.userProfile)
                          ?.id,
                      }) // @ts-ignore
                        .then((res: responseType) => {
                          if (res?.status === 200) {
                            setSessionObjectData(storageConfig?.cart, []);
                            messageService?.sendMessage(
                              "checkout-card",
                              // @ts-ignore
                              {
                                action: "clear-cart-payment-successfull",
                                params: { cart: [], oid: response?.orderId },
                              },
                              "global"
                            );
                          } else {
                            toast.error(`Error: ${res?.status}`);
                          }
                        })
                        .catch((err) => {
                          toast.error(`Error: ${err}`);
                        });
                    } else {
                      messageService?.sendMessage(
                        "checkout-card",
                        // @ts-ignore
                        {
                          action: "payment-successfull",
                          params: { oid: response?.orderId },
                        },
                        "global"
                      );
                    }
                    document.getElementById("app-close-btn")?.click();
                  })
                  .catch((err: any) => {
                    console.log("Err", err);
                    setSessionObjectData(
                      storageConfig?.orders,
                      res?.data?.returnData
                    );
                    if (source === "cart-page") {
                      callApi(processIDs?.clear_cart, {
                        userId: getSessionObjectData(storageConfig?.userProfile)
                          ?.id,
                      }) // @ts-ignore
                        .then((res: responseType) => {
                          if (res?.status === 200) {
                            setSessionObjectData(storageConfig?.cart, []);
                            messageService?.sendMessage(
                              "checkout-card",
                              // @ts-ignore
                              {
                                action: "clear-cart-payment-successfull",
                                params: { cart: [], oid: response?.orderId },
                              },
                              "global"
                            );
                          } else {
                            toast.error(`Error: ${res?.status}`);
                          }
                        })
                        .catch((err) => {
                          toast.error(`Error: ${err}`);
                        });
                    } else {
                      messageService?.sendMessage(
                        "checkout-card",
                        // @ts-ignore
                        {
                          action: "payment-successfull",
                          params: { oid: response?.orderId },
                        },
                        "global"
                      );
                    }
                    document.getElementById("app-close-btn")?.click();
                  });
              }
            } else {
              setSessionObjectData(
                storageConfig?.orders,
                res?.data?.returnData
              );
              if (source === "cart-page") {
                callApi(processIDs?.clear_cart, {
                  userId: getSessionObjectData(storageConfig?.userProfile)?.id,
                }) // @ts-ignore
                  .then((res: responseType) => {
                    if (res?.status === 200) {
                      setSessionObjectData(storageConfig?.cart, []);
                      messageService?.sendMessage(
                        "checkout-card",
                        // @ts-ignore
                        {
                          action: "clear-cart-payment-successfull",
                          params: { cart: [], oid: response?.orderId },
                        },
                        "global"
                      );
                    } else {
                      toast.error(`Error: ${res?.status}`);
                    }
                  })
                  .catch((err) => {
                    toast.error(`Error: ${err}`);
                  });
              } else {
                messageService?.sendMessage(
                  "checkout-card",
                  // @ts-ignore
                  {
                    action: "payment-successfull",
                    params: { oid: response?.orderId },
                  },
                  "global"
                );
              }
              document.getElementById("app-close-btn")?.click();
            }
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err) => {
        toast.error(`Error: ${err}`);
      });
  };
  const InitiatePayment = async () => {
    try {
      setLoading(true);
      let oid = `ORDER_${Math.floor(Math.random() * Date.now())}`;
      callApi(processIDs?.paytm_transaction_token_generate, {
        mid: MID,
        mkey: MKEY,
        oid: oid,
        value: Total,
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      })
        // @ts-ignore
        .then((res: responseType) => {
          if (res?.status === 200) {
            let config = {
              root: "",
              flow: "DEFAULT",
              data: {
                orderId: oid,
                token: res?.data?.returnData?.txnToken,
                tokenType: "TXN_TOKEN",
                amount: Total,
              },
              merchant: {
                redirect: false,
              },
              handler: {
                notifyMerchant: function (eventType: any, data: any) {
                  setLoading(false);
                  console.log("eventType => ", eventType);
                  console.log("data => ", data);
                },
                transactionStatus: function (data: any) {
                  callApi(processIDs?.paytm_transaction_verify, {
                    mid: MID,
                    oid: oid,
                    mkey: MKEY,
                  }) // @ts-ignore
                    .then((res: responseType) => {
                      if (res?.status === 200) {
                        if (res?.data?.returnCode) {
                          //  TXN_SUCCESS, TXN_FAILURE, PENDING
                          if (
                            res?.data?.returnData?.resultInfo?.resultStatus ===
                              "TXN_SUCCESS" ||
                            res?.data?.returnData?.resultInfo?.resultStatus ===
                              "PENDING"
                          ) {
                            checkoutFunc({
                              ...res?.data?.returnData,
                              address: Address,
                              total: Total.toString(),
                            });
                          } else if (
                            res?.data?.returnData?.resultInfo?.resultStatus ===
                            "TXN_FAILURE"
                          ) {
                            toast.error(`Error: Transaction failed`);
                            document.getElementById("app-close-btn")?.click();
                          }
                        }
                      } else {
                        toast.error(`Error: ${res?.status}`);
                      }
                    })
                    .catch((err: any) => {
                      toast.error(`Error: ${err?.message}`);
                    });
                },
              },
            };
            (window as any).Paytm.CheckoutJS.init(config)
              .then(function onSuccess() {
                (window as any).Paytm.CheckoutJS.invoke();
              })
              .catch(function onError(error: any) {
                setLoading(false);
                console.log("error => ", error);
              });
          } else {
            setLoading(false);
            toast.error(`Error: ${res?.status}`);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error(`Error: ${err?.message}`);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <Script
        type="application/javascript"
        src={`${paytmbaseurl}/merchantpgpui/checkoutjs/merchants/${MID}.js`}
        crossOrigin="anonymous"
      />
      <Script src="https://smtpjs.com/v3/smtp.js" />
      <button
        className={`paytm-button ${disable ? "disable" : ""}`}
        type="button"
        disabled={disable || loading}
        onClick={InitiatePayment}
      >
        {loading ? (
          <Loading className="dot-flashing" />
        ) : (
          <>
            Pay {labelConfig?.inr_code}
            {Total}
          </>
        )}
      </button>
    </>
  );
};

export default PaytmPayment;
