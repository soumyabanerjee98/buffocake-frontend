import React, { useEffect, useState } from "react";
import { processIDs } from "../../config/processID";
import { serverConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import {
  callApi,
  getSessionObjectData,
  metaUrlGenerate,
  openTab,
  setSessionObjectData,
} from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import Image from "next/image";
import WishlistCard from "../UI/WishlistCard";
import { toast } from "react-toastify";

const Wishlist = () => {
  const [wishList, setWishList] = useState<any>();

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.wishlist)) {
      setWishList(getSessionObjectData(storageConfig?.wishlist));
    }
    callApi(processIDs?.get_wishlist, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (res?.data?.returnData) {
              setSessionObjectData(
                storageConfig?.wishlist,
                res?.data?.returnData
              );
              setWishList(res?.data?.returnData);
            } else {
              setSessionObjectData(storageConfig?.wishlist, []);
              setWishList([]);
            }
          } else {
            setWishList([]);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setWishList(undefined);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
        setWishList(undefined);
      });
  }, []);

  if (wishList === undefined) return <>Loading...</>;
  if (wishList?.length === 0) {
    return (
      <div className="no-wishlist">
        <Image src={Broken} alt="Broken" height={100} priority={true} />
        <div>No wishlist found</div>
      </div>
    );
  }
  return (
    <div className="wishlist-screen">
      <div className="header">Your Wishlist</div>
      <div className="wishlist">
        {wishList?.map((i: any, idx: number) => (
          <div
            key={`wishlist-item-${idx}`}
            className="wishlist-item"
            onClick={(e: any) => {
              if (e.target.nodeName !== "BUTTON") {
                openTab(`/product/${metaUrlGenerate(i?.productMetaTitle)}`);
              }
            }}
          >
            <WishlistCard
              setWishList={setWishList}
              productId={i?.productId}
              productTitle={i?.productTitle}
              productImage={i?.productImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
