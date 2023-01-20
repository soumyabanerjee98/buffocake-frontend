import React from "react";
import Head from "next/head";
import Script from "next/script";
import { paytmConfig } from "../../config/siteConfig";
import { callApi } from "../Functions/util";
import { processIDs } from "../../config/processID";

export type PaytmPaymentProps = {
  MID: string;
  MKEY: string;
  Total: number;
};

const PaytmPayment = (props: PaytmPaymentProps) => {
  const { MID, MKEY, Total } = props;
  const InitiatePayment = async () => {
    let oid = Math.floor(Math.random() * Date.now());
    callApi(processIDs?.paytm_transaction_token_generate, {
      mid: MID,
      mkey: MKEY,
      oid: oid,
      value: Total,
      userId: "001",
    })
      .then((res: any) => {
        console.log(res?.data);
        let config = {
          root: "",
          flow: "DEFAULT",
          data: {
            orderId: oid,
            token: res?.data?.txnToken,
            tokenType: "TXN_TOKEN",
            amount: Total,
          },
          handler: {
            notifyMerchant: function (eventName: any, data: any) {
              console.log("notifyMerchant handler function called");
              console.log("eventName => ", eventName);
              console.log("data => ", data);
            },
          },
        };
        (window as any).Paytm.CheckoutJS.onLoad(
          function excecuteAfterCompleteLoad() {
            (window as any).Paytm.CheckoutJS.init(config)
              .then(function onSuccess() {
                (window as any).Paytm.CheckoutJS.invoke();
              })
              .catch(function onError(error: any) {
                console.log("error => ", error);
              });
          }
        );
      })
      .catch((err: any) => {
        console.log(err);
      });
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
        Pay &#8377;{Total}
      </button>
    </>
  );
};

export default PaytmPayment;
