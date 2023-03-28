import React, { useState } from "react";
import { labelConfig, serverConfig } from "../../../../config/siteConfig";
import Select from "react-select";
import { callApi, weightConverter } from "../../../Functions/util";
import { processIDs } from "../../../../config/processID";
import { toast } from "react-toastify";
import { responseType } from "../../../../typings";
export type OrderAccordionProps = {
  order: any;
};

const OrderAccordion = (props: OrderAccordionProps) => {
  const { order } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const [expand, setExpand] = useState(false);
  const ChangeSubStatus = (subId: string, status: string) => {
    callApi(processIDs?.update_order_substatus, {
      orderId: order?.orderId,
      subOrderId: subId,
      status: status,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
            } else {
              toast.error(`${res?.data?.msg}`);
            }
          } else {
            toast.error(`Error: ${res?.status}`);
          }
        }
      )
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  const ChangeStatus = (status: string) => {
    callApi(processIDs?.update_order_status, {
      orderId: order?.orderId,
      status: status,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
            } else {
              toast.error(`${res?.data?.msg}`);
            }
          } else {
            toast.error(`Error: ${res?.status}`);
          }
        }
      )
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  return (
    <div className="order-item">
      <div
        className="non-exp"
        onClick={() => {
          setExpand((prev) => !prev);
        }}
      >
        <div className="details">
          <div className="oid">
            Order Id: <span className="id">#{order?.orderId}</span>
          </div>
          <div className="order-time">
            Order placed on{" "}
            {order?.orderTimeStamp?.split(":", 2).toString().replace(",", ":")}
          </div>
          <div className="order-type">
            Order type:{" "}
            <span className={`${order?.type?.toLowerCase()}`}>
              {order?.type}
            </span>
          </div>
        </div>
        <div className="status">
          <div
            className={`payment-status ${order?.paymentStatus?.toLowerCase()}`}
          >
            {order?.paymentStatus}
          </div>
          <div className={`order-status ${order?.orderStatus?.toLowerCase()}`}>
            {order?.orderStatus}
          </div>
        </div>
      </div>
      {expand && (
        <div className="exp">
          <div className="left-col">
            {order?.type === "Custom" ? (
              <div className="section">
                <img
                  src={`${url}${order?.items?.[0]?.customImage}`}
                  alt="Image"
                  height={150}
                />
                <div>Weight: {weightConverter(order?.items?.[0]?.weight)}</div>
                <div>
                  Flavour:{" "}
                  {order?.items?.[0]?.flavour
                    ? order?.items?.[0]?.flavour
                    : "N/A"}
                </div>
                <div>
                  Gourmet option:{" "}
                  {order?.items?.[0]?.gourmet
                    ? order?.items?.[0]?.gourmet
                    : "N/A"}
                </div>
                <div>
                  Message on cake:{" "}
                  {order?.items?.[0]?.message
                    ? order?.items?.[0]?.message
                    : "N/A"}
                </div>
                <div>
                  Customization:{" "}
                  {order?.items?.[0]?.custom
                    ? order?.items?.[0]?.custom
                    : "N/A"}
                </div>
                <div>
                  Allergy:{" "}
                  {order?.items?.[0]?.allergy
                    ? order?.items?.[0]?.allergy
                    : "N/A"}
                </div>
                <div>Delivery date: {order?.items?.[0]?.delDate}</div>
                <div>Delivery time: {order?.items?.[0]?.delTime}</div>
                <div className="subtotal">
                  {labelConfig?.inr_code}
                  {order?.items?.[0]?.subTotal}
                </div>
              </div>
            ) : (
              <>
                {order?.items?.map((i: any) => {
                  return (
                    <div className="section">
                      {i?.subOrderId && (
                        <div>
                          Sub-Order ID:{" "}
                          <span className="id">#{i?.subOrderId}</span>
                        </div>
                      )}
                      <div>{weightConverter(i?.weight)}</div>
                      <div>Flavour: {i?.flavour ? i?.flavour : "N/A"}</div>
                      <div>
                        Gourmet option: {i?.gourmet ? i?.gourmet : "N/A"}
                      </div>
                      <div>
                        Message on cake: {i?.message ? i?.message : "N/A"}
                      </div>
                      <div>Customization: {i?.custom ? i?.custom : "N/A"}</div>
                      <div>Allergy: {i?.allergy ? i?.allergy : "N/A"}</div>
                      <div>Delivery date: {i?.delDate}</div>
                      <div>Delivery time: {i?.delTime}</div>
                      <div className="subtotal">
                        {labelConfig?.inr_code}
                        {i?.subTotal}
                      </div>
                      {i?.subOrderStatus && (
                        <div className="sub-status-update">
                          <div
                            className={`suborder-status ${i?.subOrderStatus?.toLowerCase()}`}
                          >
                            {i?.subOrderStatus}
                          </div>
                          <Select
                            isSearchable={true}
                            defaultValue={null}
                            placeholder={"Change status"}
                            onChange={(e: any) => {
                              if (e) {
                                ChangeSubStatus(i?.subOrderId, e.value);
                              }
                            }}
                            options={serverConfig?.del_status_arr}
                            isClearable={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {order?.items?.length === 1 && (
              <Select
                isSearchable={true}
                defaultValue={null}
                placeholder={"Change status"}
                onChange={(e: any) => {
                  if (e) {
                    ChangeStatus(e.value);
                  }
                }}
                options={serverConfig?.del_status_arr}
                isClearable={true}
              />
            )}
          </div>
          <div className="right-col">
            <div className="address-item">
              <div className="address-title">
                {order?.shippingAddress?.receiverName}
              </div>
              <div className="address-details">
                <div className="address-section">
                  <div className="label">House / Building : </div>
                  <div className="value">
                    {order?.shippingAddress?.house
                      ? order?.shippingAddress?.house
                      : "NA"}
                  </div>
                </div>
                <div className="address-section">
                  <div className="label">Street no. : </div>
                  <div className="value">{order?.shippingAddress?.street}</div>
                </div>
                <div className="address-section">
                  <div className="label">Pin code : </div>
                  <div className="value">{order?.shippingAddress?.pin}</div>
                </div>
              </div>
              <div className="address-contact">
                {order?.shippingAddress?.receiverContact}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAccordion;
