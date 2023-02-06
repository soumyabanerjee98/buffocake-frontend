import React, { useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { labelConfig, paytmConfig } from "../../config/siteConfig";
import { callApi } from "../Functions/util";
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
  const InitiatePayment = async () => {
    try {
      setLoading(true);
      let oid = Math.floor(Math.random() * Date.now());
      callApi(processIDs?.paytm_transaction_token_generate, {
        mid: MID,
        mkey: MKEY,
        oid: oid,
        value: Total,
        userId: "001",
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
            handler: {
              notifyMerchant: function (eventName: any, data: any) {
                setLoading(false);
                console.log("eventName => ", eventName);
                console.log("data => ", data);
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
        src={`${paytmConfig?.host}/merchantpgpui/checkoutjs/merchants/${MID}.js`}
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
