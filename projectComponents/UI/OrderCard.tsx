import React, { useState } from "react";
import { labelConfig } from "../../config/siteConfig";
import { messageService } from "../Functions/messageService";

export type OrderCardProps = { orderItem: any };

const OrderCard = (props: OrderCardProps) => {
  const { orderItem } = props;
  const [expand, setExpand] = useState(false);
  const OpenReceipt = () => {
    messageService?.sendMessage(
      "order-item-card",
      // @ts-ignore
      { params: orderItem },
      "header"
    );
  };
  return (
    <div className="order-item">
      <div className="non-exp">
        <div className="left-col">
          <div className="order-id">
            Order Id: <span className="id">#{orderItem?.orderId}</span>
          </div>
          <div className="order-date">
            Order placed on{" "}
            {orderItem?.orderTimeStamp
              ?.split(":", 2)
              .toString()
              .replace(",", ":")}
          </div>
        </div>
        <div className="right-col">
          <div
            className={`order-status ${orderItem?.orderStatus?.toLowerCase()}`}
          >
            Order {orderItem?.orderStatus}
          </div>
          <i
            className="fa-solid fa-file-invoice dropdown"
            onClick={OpenReceipt}
          />
          <i
            className={`${
              expand ? "fa-solid fa-caret-up" : "fa-solid fa-caret-down"
            } dropdown`}
            onClick={() => {
              setExpand((prev) => !prev);
            }}
          />
        </div>
      </div>
      {expand && (
        <div className="exp">
          <div className="left-col">
            {orderItem?.items?.map((i: any) => {
              return (
                <div className="section">
                  {i?.subOrderId && (
                    <div>
                      Sub-Order ID: <span className="id">#{i?.subOrderId}</span>
                    </div>
                  )}
                  <div>
                    {i?.weight}lbs {i?.productName}
                  </div>
                  <div>Flavour: {i?.flavour ? i?.flavour : "N/A"}</div>
                  <div>Gourmet option: {i?.gourmet ? i?.gourmet : "N/A"}</div>
                  <div>Message on cake: {i?.message ? i?.message : "N/A"}</div>
                  <div>Customization: {i?.custom ? i?.custom : "N/A"}</div>
                  <div>Allergy: {i?.allergy ? i?.allergy : "N/A"}</div>
                  <div>Delivery date: {i?.delDate}</div>
                  <div>Delivery time: {i?.delTime}</div>
                  <div className="subtotal">
                    {labelConfig?.inr_code}
                    {i?.subTotal}
                  </div>
                  {i?.subOrderStatus && (
                    <div
                      className={`suborder-status ${i?.subOrderStatus?.toLowerCase()}`}
                    >
                      {i?.subOrderStatus}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="right-col">
            <div className="address-item">
              <div className="address-title">
                {orderItem?.shippingAddress?.receiverName}
              </div>
              <div className="address-details">
                <div className="address-section">
                  <div className="label">House / Building : </div>
                  <div className="value">
                    {orderItem?.shippingAddress?.house
                      ? orderItem?.shippingAddress?.house
                      : "N/A"}
                  </div>
                </div>
                <div className="address-section">
                  <div className="label">Street no. : </div>
                  <div className="value">
                    {orderItem?.shippingAddress?.street}
                  </div>
                </div>
                <div className="address-section">
                  <div className="label">Pin code : </div>
                  <div className="value">{orderItem?.shippingAddress?.pin}</div>
                </div>
              </div>
              <div className="address-contact">
                {orderItem?.shippingAddress?.receiverContact}
              </div>
            </div>
            <div
              className={`payment-status ${orderItem?.paymentStatus?.toLowerCase()}`}
            >
              {orderItem?.paymentStatus} payment {labelConfig?.inr_code}
              {orderItem?.total}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
