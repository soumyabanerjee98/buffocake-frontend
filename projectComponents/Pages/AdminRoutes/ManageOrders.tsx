import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useSwr from "swr";
import { processIDs } from "../../../config/processID";
import { callApi } from "../../Functions/util";
import OrderAccordion from "./AdminRouteComponents/OrderAccordion";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_all_orders, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData?.reverse();
          } else {
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });
  return data;
};

const ManageOrders = () => {
  const {
    data: allOrders,
    isLoading,
    error,
  } = useSwr("manage-orders", dataFetcher, { refreshInterval: 1 });
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const searchOrder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setOrders(allOrders);
    } else {
      let arr: any = [];
      allOrders?.map((i: any) => {
        let searchId = i?.orderId
          ?.split("_")?.[1]
          ?.search(parseInt(e.target.value));
        if (searchId !== -1) {
          arr.push(i);
        }
      });
      setOrders(arr);
    }
  };
  const Reset = () => {
    setSearch("");
    setOrders(allOrders);
  };
  useEffect(() => {
    setOrders(allOrders);
  }, [allOrders]);
  if (isLoading) return <>Loading...</>;
  return (
    <div className="manage-orders">
      <div className="search">
        <input
          type={"number"}
          value={search}
          onChange={searchOrder}
          placeholder={"Enter order Id digits (ORDER_XXXX)"}
          className="search-input"
        />
        <button onClick={Reset}>Reset</button>
      </div>
      <div className="orders">
        {orders?.map((i: any) => {
          return <OrderAccordion order={i} />;
        })}
      </div>
    </div>
  );
};

export default ManageOrders;
