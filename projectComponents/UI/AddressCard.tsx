import React, { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
import Loading from "./Loading";

export type AddressCardProps = {
  receiverName: string;
  receiverContact: string;
  house: string;
  street: string;
  pin: any;
  fav: boolean;
  action: string;
  addressId: string;
};

const AddressCard = (props: AddressCardProps) => {
  const {
    receiverName,
    receiverContact,
    house,
    street,
    pin,
    fav,
    action,
    addressId,
  } = props;
  const [formData, setFormData] = useState({
    receiverName: receiverName,
    receiverContact: receiverContact?.split("+91")[1],
    house: house,
    street: street,
    pin: pin,
    fav: fav,
  });
  const [error, setError] = useState({
    receiverName: false,
    receiverContact: false,
    receiverContactTxt: "",
    street: false,
    pin: false,
    pinTxt: "",
  });
  const [loading, setLoading] = useState(false);
  const closePopUp = () => {
    messageService?.sendMessage(
      "address-card",
      // @ts-ignore
      { action: "close-popup" },
      "header"
    );
  };
  const clickOutSide = (e: any) => {
    if (e.target.className === "modal") {
      closePopUp();
    }
  };
  const submit = () => {
    let processId =
      action === "add-address"
        ? processIDs?.add_address
        : processIDs?.edit_address;
    let body: any = {};
    // userId, addressId, receiverName, receiverContact, house, street, pin, favorite
    if (action === "add-address") {
      body = {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
        receiverName: formData?.receiverName,
        receiverContact: formData?.receiverContact?.includes("+91")
          ? formData?.receiverContact
          : `+91${formData?.receiverContact}`,
        house: formData?.house?.replaceAll("\n", ", "),
        street: formData?.street?.replaceAll("\n", ", "),
        pin: formData?.pin,
        favorite: formData?.fav,
      };
    } else {
      body = {
        userId: getSessionObjectData(storageConfig?.userProfile)?.id,
        addressId: addressId,
        receiverName: formData?.receiverName,
        receiverContact: formData?.receiverContact?.includes("+91")
          ? formData?.receiverContact
          : `+91${formData?.receiverContact}`,
        house: formData?.house?.replaceAll("\n", ", "),
        street: formData?.street?.replaceAll("\n", ", "),
        pin: formData?.pin,
        favorite: formData?.fav,
      };
    }
    if (body?.receiverName === "") {
      setError((prev: any) => {
        return { ...prev, receiverName: true };
      });
    } else if (
      body?.receiverContact === "" ||
      body?.receiverContact === undefined
    ) {
      setError((prev: any) => {
        return {
          ...prev,
          receiverContact: true,
          receiverContactTxt: "Please enter phone number",
        };
      });
    } else if (body?.receiverContact?.length < 13) {
      setError((prev: any) => {
        return {
          ...prev,
          receiverContact: true,
          receiverContactTxt: "Please enter 10 digit phone number",
        };
      });
    } else if (body?.street === "") {
      setError((prev: any) => {
        return { ...prev, street: true };
      });
    } else if (body?.pin === "" || body?.pin === null) {
      setError((prev: any) => {
        return { ...prev, pin: true, pinTxt: "Please enter pin code" };
      });
    } else if (body?.pin?.length < 6) {
      setError((prev: any) => {
        return { ...prev, pin: true, pinTxt: "Please enter 6 digit pin code" };
      });
    } else {
      setLoading(true);
      callApi(processId, body)
        // @ts-ignore
        .then((res: responseType) => {
          setLoading(false);
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              setSessionObjectData(
                storageConfig?.address,
                res?.data?.returnData
              );
              messageService?.sendMessage(
                "address-card",
                // @ts-ignore
                { action: "address-update", params: res?.data?.returnData },
                "profile-page"
              );
              closePopUp();
            }
          } else {
            toast.error(`Error: ${res?.status}`);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          toast.error(`Error: ${err?.message}`);
        });
    }
  };
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="address-card">
        <div className="title">
          {action === "add-address" ? "Add address" : "Edit address"}
        </div>
        <div className="section">
          <div className="label">
            Receiver name <span style={{ color: "red" }}> *</span>
          </div>
          <input
            className="form-field"
            type={"text"}
            value={formData?.receiverName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setError((prev: any) => {
                return { ...prev, receiverName: false };
              });
              setFormData((prev: any) => {
                return { ...prev, receiverName: e.target.value };
              });
            }}
          />
        </div>
        {error?.receiverName && <div className="error">Please enter name</div>}
        <div className="section">
          <div className="label">
            Receiver contact <span style={{ color: "red" }}> *</span>
          </div>
          <PhoneInput
            defaultCountry={"IN"}
            addInternationalOption={false}
            autoComplete={"off"}
            limitMaxLength={true}
            maxLength={11}
            countries={["IN"]}
            placeholder="Enter phone number"
            value={formData?.receiverContact}
            onChange={(e: any) => {
              setError((prev: any) => {
                return {
                  ...prev,
                  receiverContact: false,
                  receiverContactTxt: "",
                };
              });
              setFormData((prev: any) => {
                return { ...prev, receiverContact: e };
              });
            }}
          />
        </div>
        {error?.receiverContact && (
          <div className="error">{error?.receiverContactTxt}</div>
        )}
        <div className="section textarea">
          <div className="label">House / Building</div>
          <textarea
            className="form-field-textarea"
            value={formData?.house}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormData((prev: any) => {
                return { ...prev, house: e.target.value };
              });
            }}
          />
        </div>
        <div className="section textarea">
          <div className="label">
            Street no. <span style={{ color: "red" }}> *</span>
          </div>
          <textarea
            className="form-field-textarea"
            value={formData?.street}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setError((prev: any) => {
                return { ...prev, street: false };
              });
              setFormData((prev: any) => {
                return { ...prev, street: e.target.value };
              });
            }}
          />
        </div>
        {error?.street && <div className="error">Please enter street no.</div>}
        <div className="section">
          <div className="label">
            Pin code <span style={{ color: "red" }}> *</span>
          </div>
          <input
            className="form-field-number"
            type={"number"}
            value={formData?.pin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (
                e.target.value.length <= 6 ||
                // @ts-ignore
                e.nativeEvent.inputType === "deleteContentBackward"
              ) {
                setError((prev: any) => {
                  return { ...prev, pin: false, pinTxt: "" };
                });
                setFormData((prev: any) => {
                  return { ...prev, pin: e.target.value };
                });
              }
            }}
          />
        </div>
        {error?.pin && <div className="error">{error?.pinTxt}</div>}
        <div className="section checkbox">
          <input
            className="form-field-checkbox"
            type={"checkbox"}
            checked={formData?.fav}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (getSessionObjectData(storageConfig?.address)?.length > 0) {
                setFormData((prev: any) => {
                  return { ...prev, fav: !prev.fav };
                });
              }
            }}
          />
          <div className="label">Set as favourite</div>
        </div>
        <div className="section submit">
          <button
            type="button"
            className="submit-button"
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <Loading className="dot-flashing" />
            ) : action === "add-address" ? (
              "Add"
            ) : (
              "Edit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
