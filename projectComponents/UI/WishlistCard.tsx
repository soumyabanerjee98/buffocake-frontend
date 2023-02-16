import Image from "next/image";
import React, { useState } from "react";
import { processIDs } from "../../config/processID";
import { serverConfig, storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import NoImage from "../Assets/Images/no-image.png";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import Loading from "./Loading";

export type WishlistCardProps = {
  productId: string;
  productImage: string;
  productTitle: string;
  setWishList: any;
};

const WishlistCard = (props: WishlistCardProps) => {
  const { productImage, productTitle, productId, setWishList } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const [loading, setLoading] = useState(false);
  const removeItem = (id: string) => {
    setLoading(true);
    callApi(processIDs?.remove_item_from_wishlist, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      productId: id,
    }).then((res: responseType) => {
      if (res?.data?.returnCode) {
        setLoading(false);
        setSessionObjectData(storageConfig?.wishlist, res?.data?.returnData);
        setWishList(res?.data?.returnData);
      }
    });
  };
  return (
    <>
      <div className="image-container">
        {productImage ? (
          <img
            src={`${url}${productImage}`}
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
        <div className="title">{productTitle}</div>
        <button
          type="button"
          className="remove"
          onClick={() => {
            removeItem(productId);
          }}
        >
          {loading ? <Loading className="dot-flashing" /> : "Remove"}
        </button>
      </div>
    </>
  );
};

export default WishlistCard;
