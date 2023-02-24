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
import useSwr from "swr";
const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_orders, {
    userId: getSessionObjectData(storageConfig?.userProfile)?.id,
  }) // @ts-ignore
    .then((res: responseType) => {
      if (res?.status === 200) {
        if (res?.data?.returnCode) {
          if (res?.data?.returnData) {
            let array = res?.data?.returnData?.reverse();
            setSessionObjectData(storageConfig?.orders, array);
            return array;
          } else {
            setSessionObjectData(storageConfig?.orders, []);
            return [];
          }
        } else {
          return [];
        }
      } else {
        toast.error(`Error: ${res?.status}`);
        return undefined;
      }
    })
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return undefined;
    });
  return data;
};

const Orders = () => {
  const router = useRouter();
  const {
    data: allOrders,
    isLoading,
    error,
  } = useSwr("get-orders", dataFetcher, { refreshInterval: 5000 });
  const [orders, setOrders] = useState<any>(allOrders);
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.orders)) {
      setOrders(getSessionObjectData(storageConfig?.orders));
    } else {
      setOrders(allOrders);
    }
  }, [allOrders]);
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
