import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { storageConfig } from "../../config/siteConfig";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import OrderCard from "../UI/OrderCard";

const Orders = () => {
  const [orders, setOrders] = useState<any>();
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.orders)) {
      setOrders(getSessionObjectData(storageConfig?.orders));
    }
    callApi(processIDs?.get_orders, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (res?.data?.returnData) {
              setSessionObjectData(
                storageConfig?.orders,
                res?.data?.returnData
              );
              setOrders(res?.data?.returnData);
            } else {
              setSessionObjectData(storageConfig?.orders, []);
              setOrders([]);
            }
          } else {
            setOrders([]);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setOrders(undefined);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
        setOrders(undefined);
      });
  }, []);
  if (orders === undefined) return <>Loading...</>;
  return (
    <div className="order-screen">
      <div className="header">Your Orders</div>
      <div className="order-list">
        {orders?.map((i: any) => {
          return <OrderCard orderItem={i} />;
        })}
      </div>
    </div>
  );
};

export default Orders;
