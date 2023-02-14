import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { processIDs } from "../../config/processID";
import { serverConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import { callApi, getSessionObjectData } from "../Functions/util";
import Broken from "../Assets/Images/broken.png";
import Image from "next/image";
import NoImage from "../Assets/Images/no-image.png";
import { useRouter } from "next/router";
import Loading from "../UI/Loading";

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
  } = useSwr(`${processIDs?.get_wishlist}`, dataFetcher, {
    refreshInterval: 1,
  });
  const [wishList, setWishList] = useState(wishlist);
  const [loading, setLoading] = useState(false);
  const removeItem = (id: string) => {
    setLoading(true);
    callApi(processIDs?.remove_item_from_wishlist, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      productId: id,
    }).then((res: responseType) => {
      if (res?.data?.returnCode) {
        setLoading(false);
        setWishList(res?.data?.returnData);
      }
    });
  };

  useEffect(() => {
    setWishList(wishlist);
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
            <div className="image-container">
              {i?.productImage ? (
                <img
                  src={`${url}${i?.productImage}`}
                  className="image"
                  alt="Image not found!"
                />
              ) : (
                <Image
                  src={NoImage}
                  alt="Image not found!"
                  priority={true}
                  className="image"
                />
              )}
            </div>
            <div className="details">
              <div className="title">{i?.productTitle}</div>
              <button
                type="button"
                className="remove"
                onClick={() => {
                  removeItem(i?.productId);
                }}
              >
                {loading ? <Loading className="dot-flashing" /> : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
