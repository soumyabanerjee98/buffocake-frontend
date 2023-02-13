import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import {
  labelConfig,
  paytmConfig,
  storageConfig,
} from "../../config/siteConfig";
import {
  callApi,
  getLocalObjectData,
  getSessionObjectData,
} from "../Functions/util";
import { processIDs } from "../../config/processID";
import Loading from "./Loading";
import { responseType } from "../../typings";

export type PaytmPaymentProps = {
  MID: string;
  MKEY: string;
  Total: number;
};

const PaytmPayment = (props: PaytmPaymentProps) => {
  const { MID, MKEY, Total } = props;
  const [loading, setLoading] = useState(false);
  const env = process.env.NODE_ENV;
  const paytmbaseurl =
    env === "production" ? paytmConfig?.host : paytmConfig?.stage_host;
  const InitiatePayment = async () => {
    try {
      setLoading(true);
      let oid = Math.floor(Math.random() * Date.now());
      callApi(processIDs?.paytm_transaction_token_generate, {
        mid: MID,
        mkey: MKEY,
        oid: oid,
        value: Total,
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      })
        .then((res: responseType) => {
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
                }).then((res: responseType) => {
                  if (res?.data?.returnCode) {
                    document.getElementById("app-close-btn")?.click();
                    //  TXN_SUCCESS, TXN_FAILURE, PENDING
                    console.log(
                      "payment status ",
                      res?.data?.returnData?.resultInfo?.resultStatus
                    );
                  }
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
        })
        .catch((err: any) => {
          setLoading(false);
          console.log(err);
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
      <button className="paytm-button" type="button" onClick={InitiatePayment}>
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
