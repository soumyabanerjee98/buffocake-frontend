import React from "react";
import { labelConfig } from "../../config/siteConfig";
import { messageService } from "../Functions/messageService";
export type OrderReceiptProps = {
  order: any;
};
const OrderReceipt = (props: OrderReceiptProps) => {
  const { order } = props;
  const html2pdf = require("html2pdf.js");
  const closePopUp = () => {
    messageService?.sendMessage(
      "receipt-card",
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
  const download = () => {
    let element = document.getElementById("order-receipt");
    let opt = {
      filename: `Boffocakes_${order?.orderId}.pdf`,
      jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      html2canvas: { scale: 10 },
    };
    html2pdf().from(element).set(opt).save();
  };
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="order-receipt-card">
        <i
          className="fa fa-download download"
          aria-hidden="true"
          onClick={download}
        />
        <div id="order-receipt" style={{ margin: "5rem" }}>
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
                Product
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Weight
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Flavour
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Gourmet option
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Message on cake
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Customization
              </th>
              <th style={{ border: "1px solid black", padding: "0.8rem" }}>
                Allergy
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
            {order?.items?.map((i: any) => {
              return (
                <tr>
                  {i?.subOrderId && (
                    <td style={{ textAlign: "center" }}>#{i?.subOrderId}</td>
                  )}
                  <td style={{ textAlign: "center" }}>{i?.productName}</td>
                  <td style={{ textAlign: "center" }}>{i?.weight}lbs</td>
                  <td style={{ textAlign: "center" }}>{i?.flavour}</td>
                  <td style={{ textAlign: "center" }}>{i?.gourmet}</td>
                  <td style={{ textAlign: "center" }}>{i?.message}</td>
                  <td style={{ textAlign: "center" }}>{i?.custom}</td>
                  <td style={{ textAlign: "center" }}>{i?.allergy}</td>
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
                <div>{order?.shippingAddress?.receiverName}</div>
                <div>
                  {order?.shippingAddress?.house
                    ? `${order?.shippingAddress?.house}, `
                    : ""}
                  {`${order?.shippingAddress?.street}, `}
                  {`${order?.shippingAddress?.pin}`}
                </div>
                <div>{`${order?.shippingAddress?.receiverContact}`}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
