import Image from "next/image";
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
import Broken from "../Assets/Images/broken.png";
import { useRouter } from "next/router";

const Orders = () => {
  const router = useRouter();
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
              let array = res?.data?.returnData?.reverse();
              setSessionObjectData(storageConfig?.orders, array);
              setOrders(array);
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
  if (orders?.length === 0)
    return (
      <div className="no-cart">
        <Image src={Broken} alt="Broken" height={100} priority={true} />
        <div>No order found</div>
        <div
          className="buy"
          onClick={() => {
            router.push("/");
          }}
        >
          Buy products
        </div>
      </div>
    );
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
