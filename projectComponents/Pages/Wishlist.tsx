import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../config/processID";
import { serverConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import Image from "next/image";
import { useRouter } from "next/router";
import WishlistCard from "../UI/WishlistCard";

const Wishlist = () => {
  const router = useRouter();
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const dataFetcher = async () => {
    let data = await callApi(processIDs?.get_wishlist, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
    }).then((res: responseType) => {
      if (res?.data?.returnCode) {
        if (res?.data?.returnData) {
          return res?.data?.returnData;
        } else {
          return [];
        }
      } else {
        return [];
      }
    });
    return data;
  };
  const {
    data: wishlist,
    isLoading,
    error,
  } = useSwr(`${processIDs?.get_wishlist}`, dataFetcher);
  const [wishList, setWishList] = useState(wishlist);

  useEffect(() => {
    if (getSessionObjectData(storageConfig?.wishlist)) {
      setWishList(getSessionObjectData(storageConfig?.wishlist));
    } else {
      if (wishlist?.length > 0) {
        setSessionObjectData(storageConfig?.wishlist, wishlist);
      }
      setWishList(wishlist);
    }
  }, [wishlist]);

  if (isLoading) return <>Loading...</>;
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
                router.push(`/product/${i?.productId}`);
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
