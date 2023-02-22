import React, { useState, useEffect } from "react";
import { messageService } from "../Functions/messageService";
import Congrats from "../Assets/Images/fireworks.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSessionObjectData } from "../Functions/util";
import {
  labelConfig,
  serverConfig,
  storageConfig,
} from "../../config/siteConfig";
import Script from "next/script";
import { jsPDF } from "jspdf";
export type OrderSuccessCardProps = {
  order: any;
};
const OrderSuccessCard = (props: OrderSuccessCardProps) => {
  const { order } = props;
  const url = serverConfig?.backend_url_server;
  const router = useRouter();
  const [mailsent, setMailsent] = useState(false);
  const html2canvas = require("html2canvas");
  let dataurl: string;
  const closePopUp = () => {
    router.push("/orders");
    messageService?.sendMessage(
      "order-success-card",
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
  useEffect(() => {
    setMailsent(true);
  }, []);
  useEffect(() => {
    if (mailsent) {
      if (getSessionObjectData(storageConfig?.userProfile)?.email) {
        let element = document.getElementById("order-receipt");
        if (element?.innerHTML !== "" && element?.innerText !== "") {
          html2canvas(element).then((canv: any) => {
            dataurl = canv.toDataURL();
            let config = {
              SecureToken: serverConfig?.smtp_creds?.security_token,
              To: getSessionObjectData(storageConfig?.userProfile)?.email,
              From: serverConfig?.smtp_creds?.from,
              Subject: `Order confirmed #${order?.orderId}`,
              Body: `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="x-apple-disable-message-reformatting"><title></title><style type="text/css">@media only screen and (min-width: 620px) {.u-row {width: 600px !important;}.u-row .u-col {vertical-align: top;}.u-row .u-col-100 {width: 600px !important;}}@media (max-width: 620px) {.u-row-container {max-width: 100% !important;padding-left: 0px !important;padding-right: 0px !important;}.u-row .u-col {min-width: 320px !important;max-width: 100% !important;display: block !important;}.u-row {width: 100% !important;}.u-col {width: 100% !important;}.u-col > div {margin: 0 auto;}}body {margin: 0;padding: 0;}table,tr,td {vertical-align: top;border-collapse: collapse;}p {margin: 0;}.ie-container table,.mso-container table {table-layout: fixed;}* {line-height: inherit;}a[x-apple-data-detectors='true'] {color: inherit !important;text-decoration: none !important;}table, td { color: #000000; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 65% !important; } #u_content_heading_1 .v-font-size { font-size: 22px !important; } #u_content_heading_2 .v-text-align { text-align: center !important; } #u_content_text_2 .v-container-padding-padding { padding: 0px 20px 20px !important; } #u_content_text_2 .v-text-align { text-align: center !important; } }</style><link href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head><body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #eeeeee;color: #000000"><table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #eeeeee;width:100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="height: 100%;width: 100% !important;"><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><table id="u_content_image_1" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 10px;font-family:'Rubik',sans-serif;" align="left"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center"><img align="center" border="0" src="${url}boffocake-logo.png" alt="email icon" title="email icon" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 290px;" width="290" class="v-src-width v-src-max-width"/></td></tr></table></td></tr></tbody></table><table id="u_content_heading_1" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 0px;font-family:'Rubik',sans-serif;" align="left"><h1 class="v-text-align v-font-size" style="margin: 0px; color: #6b2733; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 28px; "><strong>Order Confirmation</strong></h1></td></tr></tbody></table><table style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:5px 10px 40px;font-family:'Rubik',sans-serif;" align="left"><div class="v-text-align v-font-size" style="color: #ecf0f1; line-height: 140%; text-align: center; word-wrap: break-word;"><p style="font-size: 14px; line-height: 140%;"><span style="font-size: 18px; line-height: 25.2px;">24 Mar 2022</span></p></div></td></tr></tbody></table></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: transparent"><div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"><div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;"><div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"><div style="background-color: #eeeeee;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><table id="u_content_heading_2" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 30px 0px;font-family:'Rubik',sans-serif;" align="left"><h1 class="v-text-align v-font-size" style="margin: 0px; color: #000000; line-height: 140%; text-align: left; word-wrap: break-word; font-family: 'Montserrat',sans-serif; font-size: 18px; "><strong>Hi ${
                getSessionObjectData(storageConfig?.userProfile)?.firstName
              }!</strong></h1></td></tr></tbody></table><table id="u_content_text_2" style="font-family:'Rubik',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody><tr><td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 30px 20px;font-family:'Rubik',sans-serif;" align="left"><div class="v-text-align v-font-size" style="font-family: 'Montserrat',sans-serif; color: #000000; line-height: 170%; text-align: left; word-wrap: break-word;"><p style="font-size: 14px; line-height: 170%;">Your order <span style="color: #3598db; line-height: 23.8px;">#${
                order?.orderId
              } <span style="color: #000000; line-height: 23.8px;">is confirmed! Please find the receipt in the attachment. If there is something wrong, please visit our website and find your order receipt attached with your order history.<br /><br />Thank you for shopping with us!</span></span></p></div></td></tr></tbody></table></div></div></div></div></div></td></tr></tbody></table></body></html>`,
              Attachments: [
                {
                  name: `Boffocakes_${order?.orderId}.png`,
                  data: dataurl,
                },
              ],
            };
            let api_config = {
              headers: {
                "X-ElasticEmail-ApiKey": serverConfig?.el_email_apiKey,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              method: "POST",
              body: JSON.stringify({
                Recipients: {
                  To: [
                    `${
                      getSessionObjectData(storageConfig?.userProfile)?.email
                    }`,
                  ],
                },
                Content: {
                  Merge: {
                    to_name: getSessionObjectData(storageConfig?.userProfile)
                      ?.firstName,
                    oid: order?.orderId,
                  },
                  Attachments: [
                    {
                      BinaryContent: dataurl,
                      Name: `Boffocakes_${order?.orderId}.png`,
                    },
                  ],
                  Headers: {
                    to_name: getSessionObjectData(storageConfig?.userProfile)
                      ?.firstName,
                    oid: order?.orderId,
                  },
                  Subject: `Order confirmed #${order?.orderId}`,
                  TemplateName: "OrderConfirm",
                },
              }),
            };
            // fetch(
            //   "https://api.elasticemail.com/v4/emails/transactional",
            //   // @ts-ignore
            //   api_config
            // )
            //   .then((res: any) => {
            //     console.log(res, "success api");
            //   })
            //   .catch((err: any) => {
            //     console.log(err, "bad api");
            //   });
            if ((window as any).Email) {
              (window as any).Email.send(config)
                .then((res: any) => {
                  console.log("email success", res);
                  setTimeout(() => {
                    closePopUp();
                  }, 5000);
                })
                .catch((err: any) => {
                  console.log("err in mail", err);
                  setTimeout(() => {
                    closePopUp();
                  }, 5000);
                });
            }
          });
        }
      } else {
        setTimeout(() => {
          closePopUp();
        }, 5000);
      }
    }
  }, [mailsent]);

  return (
    <>
      <Script src="https://smtpjs.com/v3/smtp.js" />
      <div className="modal" onClick={clickOutSide}>
        <div className="order-success-card">
          <Image src={Congrats} alt="Congratulations" height={60} width={60} />
          <div className="order-details">
            <div className="section greet">Thank you for shopping with us!</div>
            <div className="section">
              Your order ID is: <span className="oid">{order?.orderId}</span>
            </div>
            {getSessionObjectData(storageConfig?.userProfile)?.email && (
              <>
                <div className="section">
                  Confirmation mail is sent to{" "}
                  <span className="oid">
                    {getSessionObjectData(storageConfig?.userProfile)?.email}.
                  </span>
                </div>
                <div>Didn't get an email? Check your spam folder!</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: "block", opacity: "0", position: "absolute" }}>
        <div id="order-receipt" style={{ padding: "5rem" }}>
          <div
            style={{
              paddingBottom: "2rem",
              fontWeight: "500",
              fontSize: "20px",
            }}
          >
            Order ID: #{order?.orderId}
          </div>
          <table style={{ border: "1px solid black" }}>
            <tr>
              {order?.cart?.length > 1 && (
                <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                  Sub-Order ID
                </th>
              )}
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Product name
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Product quantity
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Product weight
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Delivery date
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Delivery time
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Subtotal
              </th>
            </tr>
            {order?.cart?.map((i: any) => {
              return (
                <tr>
                  {i?.subOrderId && (
                    <td style={{ textAlign: "center" }}>#{i?.subOrderId}</td>
                  )}
                  <td style={{ textAlign: "center" }}>{i?.productName}</td>
                  <td style={{ textAlign: "center" }}>{i?.qty}</td>
                  <td style={{ textAlign: "center" }}>{i?.weight}lbs</td>
                  <td style={{ textAlign: "center" }}>{i?.delDate}</td>
                  <td style={{ textAlign: "center" }}>{i?.delTime}</td>
                  <td style={{ textAlign: "center" }}>
                    {labelConfig?.inr_code}
                    {i?.subTotal}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                style={{
                  paddingTop: "2rem",
                  textAlign: "start",
                  fontWeight: "600",
                }}
              >
                Grand Total: {labelConfig?.inr_code}
                {order?.total}
              </td>
            </tr>
          </table>
          <table style={{ marginTop: "2rem", border: "1px solid black" }}>
            <tr>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Shipping address
              </th>
            </tr>
            <tr>
              <td>
                <div>{order?.address?.receiverName}</div>
                <div>
                  {order?.address?.house ? `${order?.address?.house}, ` : ""}
                  {`${order?.address?.street}, `}
                  {`${order?.address?.pin}`}
                </div>
                <div>{`${order?.address?.receiverContact}`}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessCard;
