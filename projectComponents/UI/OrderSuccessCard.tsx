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
            Body: `<strong>Hi ${
              getSessionObjectData(storageConfig?.userProfile)?.firstName
            }, Your Order #${order?.orderId} is confirmed.</strong>`,
            Attachments: [
              {
                name: `Boffocakes_${order?.orderId}.png`,
                data: dataurl,
              },
            ],
          };
          // let api_config = {
          //   headers: {
          //     "X-ElasticEmail-ApiKey": serverConfig?.el_email_apiKey,
          //     "Content-Type": "application/json",
          //     "Access-Control-Allow-Origin": "*",
          //   },
          //   method: "POST",
          //   body: JSON.stringify({
          //     Recipients: {
          //       To: [
          //         `${getSessionObjectData(storageConfig?.userProfile)?.email}`,
          //       ],
          //     },
          //     Content: {
          //       Merge: {
          //         to_name: getSessionObjectData(storageConfig?.userProfile)
          //           ?.firstName,
          //         oid: order?.orderId,
          //       },
          //       Attachments: [
          //         {
          //           BinaryContent: dataurl,
          //           Name: `Boffocakes_${order?.orderId}.png`,
          //         },
          //       ],
          //       Headers: {
          //         to_name: getSessionObjectData(storageConfig?.userProfile)
          //           ?.firstName,
          //         oid: order?.orderId,
          //       },
          //       Subject: `Order confirmed #${order?.orderId}`,
          //       TemplateName: "OrderConfirm",
          //     },
          //   }),
          // };
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
          if ((window as any).Email && mailsent === false) {
            (window as any).Email.send(config)
              .then((res: any) => {
                console.log("email success", res);
                setMailsent(true);
                setTimeout(() => {
                  closePopUp();
                }, 5000);
              })
              .catch((err: any) => {
                console.log("err in mail", err);
                setMailsent(true);
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
              {order?.items?.length > 1 && (
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
