import React, { useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { storageConfig } from "../../config/siteConfig";
import { responseType } from "../../typings";
import { messageService } from "../Functions/messageService";
import {
  callApi,
  getSessionObjectData,
  setSessionObjectData,
} from "../Functions/util";
import StarIcon from "./Icons/StarIcon";
import Loading from "./Loading";
export type AddressItemCardProps = {
  address: any;
};

const AddressItemCard = (props: AddressItemCardProps) => {
  const { address } = props;
  const [loading, setLoading] = useState(false);
  const EditAddress = () => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      {
        action: "edit-address",
        params: {
          addressId: address?._id,
          name: address?.receiverName,
          contact: address?.receiverContact,
          house: address?.house,
          street: address?.street,
          pin: address?.pin,
          fav: address?.favorite,
        },
      },
      "header"
    );
  };

  const DeleteAddress = () => {
    setLoading(true);
    callApi(processIDs?.remove_address, {
      userId: getSessionObjectData(storageConfig?.userProfile)?.id,
      addressId: address?._id,
      // @ts-ignore
    }).then((res: responseType) => {
      setLoading(false);
      if (res?.status === 200) {
        if (res?.data?.returnCode) {
          setSessionObjectData(storageConfig?.address, res?.data?.returnData);
          messageService?.sendMessage(
            "address-item-card",
            // @ts-ignore
            { action: "address-update", params: res?.data?.returnData },
            "profile-page"
          );
        }
      } else {
        toast?.error(`Error: ${res?.status}`);
      }
    });
  };

  return (
    <div className={`address-item ${address?.favorite ? "fav" : ""}`}>
      <div className="address-details">
        <div className="address-name">{address?.receiverName}</div>
        <div className="address-details">
          {address?.house && `${address?.house}, `}
          {`${address?.street}, `}
          {`${address?.pin}`}
        </div>
        <div className="address-contact">{address?.receiverContact}</div>
      </div>
      <div className="action-buttons">
        <button className="edit-address-button" onClick={EditAddress}>
          Edit
        </button>
        <button className="delete-address-button" onClick={DeleteAddress}>
          {loading ? <Loading className="dot-flashing" /> : "Delete"}
        </button>
      </div>
      {address?.favorite && (
        <div className="address-fav">
          <StarIcon />
        </div>
      )}
    </div>
  );
};

export default AddressItemCard;
