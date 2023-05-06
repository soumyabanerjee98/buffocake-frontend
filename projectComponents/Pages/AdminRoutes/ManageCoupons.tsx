import React, { Fragment, useEffect, useState } from "react";
import useSwr from "swr";
import { callApi } from "../../Functions/util";
import { processIDs } from "../../../config/processID";
import { toast } from "react-toastify";
import { labelConfig } from "../../../config/siteConfig";
import { responseType } from "../../../typings";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_all_coupons, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
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

const ManageCoupons = () => {
  const {
    data: allCoupons,
    isLoading,
    error,
  } = useSwr("manage-coupons", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const [coupons, setCoupons] = useState<any[]>(allCoupons);
  const [newCoupon, setNewCoupon] = useState<{
    name: string;
    value: number | null;
  }>({
    name: "",
    value: null,
  });
  useEffect(() => {
    setCoupons(allCoupons);
  }, [allCoupons]);
  const addCoupon = async () => {
    if (newCoupon?.name === "") {
      toast.error("Give coupon name!");
      return;
    }
    if (newCoupon?.value?.toString() === "") {
      toast.error("Give coupon value!");
      return;
    }
    const response = await callApi(processIDs?.add_coupon, newCoupon);
    const data: responseType = {
      status: response?.status,
      data: response?.data,
    };
    if (data?.status !== 200) {
      toast.error(`Error: ${data?.status}`);
      return;
    }
    if (!data?.data?.returnCode) {
      toast.error(data?.data?.msg);
      return;
    }
    setCoupons(data?.data?.returnData);
    setNewCoupon((prev: any) => {
      return { ...prev, name: "", value: null };
    });
  };
  const deleteCoupon = async (id: string) => {
    const response = await callApi(processIDs?.delete_coupon, { couponId: id });
    const data: responseType = {
      status: response?.status,
      data: response?.data,
    };
    if (data?.status !== 200) {
      toast.error(`Error: ${data?.status}`);
      return;
    }
    if (!data?.data?.returnCode) {
      toast.error(data?.data?.msg);
      return;
    }
    setCoupons(data?.data?.returnData);
  };
  const Coupon = (props: {
    coupon: { _id: string; name: string; value: number };
  }) => {
    const { coupon } = props;
    const [hover, setHover] = useState(false);
    const deleteTargetCoupon = () => {
      deleteCoupon(coupon?._id);
    };
    return (
      <div
        className="coupon"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
      >
        {coupon?.name} (- {labelConfig?.inr_code}
        {coupon?.value})
        {hover && (
          <button className="delete" onClick={deleteTargetCoupon}>
            Delete
          </button>
        )}
      </div>
    );
  };
  if (isLoading) return <>Loading...</>;
  return (
    <div className="manage-coupons">
      <div className="all-coupons">
        {coupons?.length === 0 ? (
          <div className="no-coupon">No Coupons</div>
        ) : (
          coupons?.map((i) => (
            <Fragment key={`coupon-${i?._id}`}>
              <Coupon coupon={i} />
            </Fragment>
          ))
        )}
      </div>
      <div className="add-coupon">
        <div className="header">Add coupon</div>
        <hr />
        <div className="label">Name</div>
        <input
          type="text"
          value={newCoupon?.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNewCoupon((prev: any) => {
              return { ...prev, name: e.target.value };
            });
          }}
        />
        <div className="label">Value</div>
        <input
          type="number"
          value={newCoupon?.value ? newCoupon?.value : ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            // @ts-ignore
            if (e.nativeEvent.inputType) {
              setNewCoupon((prev: any) => {
                return { ...prev, value: parseFloat(e.target.value) };
              });
            }
          }}
        />
        <button type="button" className="add" onClick={addCoupon}>
          Add
        </button>
      </div>
    </div>
  );
};

export default ManageCoupons;
