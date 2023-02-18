import Image from "next/image";
import React, { useEffect, useState } from "react";
import { processIDs } from "../../../config/processID";
import { serverConfig, storageConfig } from "../../../config/siteConfig";
import { messageType, responseType } from "../../../typings";
import { messageService } from "../../Functions/messageService";
import Avatar from "../../Assets/Images/user.png";
import Edit from "../../Assets/Images/edit.png";
import Delete from "../../Assets/Images/delete.png";
import Plus from "../../Assets/Images/plus.png";

import {
  callApi,
  getLocalObjectData,
  getSessionObjectData,
  gSignInWithPopup,
  gSignOut,
  setLocalObjectData,
  setSessionObjectData,
} from "../../Functions/util";
import Loading from "../../UI/Loading";
import { toast } from "react-toastify";
import StarIcon from "../../UI/Icons/StarIcon";
import AddressItemCard from "../../UI/AddressItemCard";
import { cache } from "swr/_internal";
export type BasicDetailsProps = {
  profile: any;
};

const BasicDetails = (props: BasicDetailsProps) => {
  const { profile } = props;
  const url =
    process.env.NODE_ENV === "production"
      ? serverConfig?.backend_url_server
      : serverConfig?.backend_url_test;
  const [editState, setEditState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });
  const [image, setImage] = useState({
    deleted: false,
    image: [],
    preview: null,
  });
  const [profileData, setProfileData] = useState({
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    email: profile?.email,
    phoneNumber: profile?.phoneNumber,
  });
  const [address, setAddress] = useState<any>();
  const cancelProfileEdit = () => {
    setLoading(false);
    setEditState(false);
    setError((prev: any) => {
      return {
        ...prev,
        firstName: false,
        lastName: false,
        phoneNumber: false,
      };
    });
    setImage((prev: any) => {
      return { ...prev, deleted: false, image: [], preview: null };
    });
  };
  useEffect(() => {
    if (getSessionObjectData(storageConfig?.address)) {
      setAddress(getSessionObjectData(storageConfig?.address));
    }
    callApi(processIDs?.get_address, {
      userId: profile?.id,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            if (res?.data?.returnData) {
              setAddress(res?.data?.returnData);
              setSessionObjectData(
                storageConfig?.address,
                res?.data?.returnData
              );
            } else {
              setAddress([]);
              setSessionObjectData(storageConfig?.address, []);
            }
          } else {
            setAddress([]);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setAddress(undefined);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
        setAddress(undefined);
      });
  }, []);
  const getEmail = () => {
    gSignInWithPopup().then((res: any) => {
      gSignOut();
      setProfileData((prev: any) => {
        return { ...prev, email: res?.user?.email };
      });
    });
  };

  const refreshUser = (userData: any) => {
    setSessionObjectData(storageConfig?.userProfile, userData);
    cancelProfileEdit();
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      { action: "refresh-profile" },
      "global"
    );
  };

  const UpdateProfile = () => {
    if (profileData?.firstName === "" || profileData?.lastName === "") {
      if (profileData?.firstName === "") {
        setError((prev: any) => {
          return { ...prev, firstName: true };
        });
      } else if (profileData?.lastName === "") {
        setError((prev: any) => {
          return { ...prev, lastName: true };
        });
      }
    } else {
      setLoading(true);
      if (image?.image?.length > 0) {
        if (profile?.profilePhoto) {
          callApi(processIDs?.delete_photo, {
            mediaPath: profile?.profilePhoto,
          }) // @ts-ignore
            .then((res: responseType) => {
              if (res?.status === 200) {
                if (res?.data?.returnCode) {
                  // @ts-ignore
                  uploadImage(image?.image).then((res: responseType) => {
                    if (res?.status === 200) {
                      callApi(processIDs?.update_user, {
                        id: getSessionObjectData(storageConfig?.userProfile)
                          ?.id,
                        firstName: profileData?.firstName,
                        lastName: profileData?.lastName,
                        phoneNumber: profileData?.phoneNumber,
                        email: profileData?.email,
                        profilePhoto: res?.data?.returnData[0]?.path,
                      }) // @ts-ignore
                        .then((res: responseType) => {
                          if (res?.status === 200) {
                            if (res?.data?.returnCode) {
                              refreshUser(res?.data?.returnData?.profile);
                            }
                          } else {
                            toast.error(`Error: ${res?.status}`);
                          }
                          setLoading(false);
                        })
                        .catch((err: any) => {
                          toast.error(`Error: ${err?.message}`);
                          setLoading(false);
                        });
                    } else {
                      setLoading(false);
                      toast.error(`Error: ${res?.status}`);
                    }
                  });
                } else {
                  setLoading(false);
                }
              } else {
                setLoading(false);
                toast.error(`Error: ${res?.status}`);
              }
            })
            .catch((err: any) => {
              setLoading(false);
              toast.error(`Error: ${err?.message}`);
            });
        } else {
          // @ts-ignore
          uploadImage(image?.image).then((res: responseType) => {
            if (res?.status === 200) {
              callApi(processIDs?.update_user, {
                id: getSessionObjectData(storageConfig?.userProfile)?.id,
                firstName: profileData?.firstName,
                lastName: profileData?.lastName,
                phoneNumber: profileData?.phoneNumber,
                email: profileData?.email,
                profilePhoto: res?.data?.returnData[0]?.path,
              }) // @ts-ignore
                .then((res: responseType) => {
                  if (res?.status === 200) {
                    if (res?.data?.returnCode) {
                      refreshUser(res?.data?.returnData?.profile);
                    }
                  } else {
                    toast.error(`Error: ${res?.status}`);
                  }
                  setLoading(false);
                })
                .catch((err: any) => {
                  setLoading(false);
                  toast.error(`Error: ${err?.message}`);
                });
            } else {
              setLoading(false);
              toast.error(`Error: ${res?.status}`);
            }
          });
        }
      } else if (image?.deleted) {
        callApi(processIDs?.delete_photo, {
          mediaPath: profile?.profilePhoto,
        }) // @ts-ignore
          .then((res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                callApi(processIDs?.update_user, {
                  id: getSessionObjectData(storageConfig?.userProfile)?.id,
                  firstName: profileData?.firstName,
                  lastName: profileData?.lastName,
                  phoneNumber: profileData?.phoneNumber,
                  email: profileData?.email,
                  profilePhoto: null,
                }) // @ts-ignore
                  .then((res: responseType) => {
                    if (res?.status === 200) {
                      if (res?.data?.returnCode) {
                        refreshUser(res?.data?.returnData?.profile);
                      }
                    } else {
                      toast.error(`Error: ${res?.status}`);
                    }
                    setLoading(false);
                  })
                  .catch((err: any) => {
                    setLoading(false);
                    toast.error(`Error: ${err?.message}`);
                  });
              } else {
                setLoading(false);
              }
            } else {
              setLoading(false);
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            setLoading(false);
            toast.error(`Error: ${err?.message}`);
          });
      } else {
        callApi(processIDs?.update_user, {
          id: getSessionObjectData(storageConfig?.userProfile)?.id,
          firstName: profileData?.firstName,
          lastName: profileData?.lastName,
          phoneNumber: profileData?.phoneNumber,
          email: profileData?.email,
          profilePhoto: profile?.profilePhoto,
        }) // @ts-ignore
          .then((res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                refreshUser(res?.data?.returnData?.profile);
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
            setLoading(false);
          })
          .catch((err: any) => {
            setLoading(false);
            toast.error(`Error: ${err?.message}`);
          });
      }
    }
  };

  const VerifyAndUpdatePhone = () => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      { action: "phone-verify" },
      "global"
    );
  };

  const editImage = (e: any) => {
    const fileArr = Array.from(e.target.files);
    const imageSrc = URL.createObjectURL(e.target.files[0]);
    setImage((prev: any) => {
      return { ...prev, image: fileArr, preview: imageSrc };
    });
  };

  const AddAddress = () => {
    const favData = () => {
      if (address?.length > 0) {
        let data = address?.find((i: any) => {
          return i?.favorite === true;
        });
        if (data) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    };
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      {
        action: "add-address",
        params: {
          name: `${
            getSessionObjectData(storageConfig?.userProfile)?.firstName
          } ${getSessionObjectData(storageConfig?.userProfile)?.lastName}`,
          contact: `${
            getSessionObjectData(storageConfig?.userProfile)?.phoneNumber
          }`,
          fav: favData(),
        },
      },
      "header"
    );
  };

  const EditAddress = (item: any) => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      {
        action: "edit-address",
        params: {
          addressId: item?._id,
          name: item?.receiverName,
          contact: item?.receiverContact,
          house: item?.house,
          street: item?.street,
          pin: item?.pin,
          fav: item?.favorite,
        },
      },
      "header"
    );
  };

  useEffect(() => {
    // @ts-ignore
    messageService?.onReceive()?.subscribe((m: messageType) => {
      if (m?.sender === "phone-verify-card") {
        if (m?.message?.action === "success-verify") {
          setProfileData((prev: any) => {
            return { ...prev, phoneNumber: m?.message?.params };
          });
        }
      } else if (
        m?.sender === "address-card" ||
        m?.sender === "address-item-card"
      ) {
        if (m?.message?.action === "address-update") {
          setAddress(m?.message?.params);
        }
      }
    });
  }, []);

  return (
    <>
      <div className="header">Personal Details</div>
      <hr />
      <div className="profile-photo-container">
        {profile?.profilePhoto ? (
          <>
            {image?.image?.length > 0 ? (
              <img className="profile-photo" src={`${image?.preview}`} />
            ) : image?.deleted ? (
              <Image src={Avatar} alt="Profile photo" height={150} />
            ) : (
              <img
                className="profile-photo"
                src={`${url}${profile?.profilePhoto}`}
              />
            )}
          </>
        ) : image?.image?.length > 0 ? (
          <img className="profile-photo" src={`${image?.preview}`} />
        ) : (
          <Image src={Avatar} alt="Profile photo" height={150} />
        )}
        {editState && (
          <>
            <div className="edit-photo-button">
              {profile?.profilePhoto && !image?.deleted ? (
                <>
                  <div className="delete-photo">
                    <Image
                      src={Delete}
                      alt="Delete icon"
                      height={30}
                      onClick={() => {
                        setImage((prev: any) => {
                          return {
                            ...prev,
                            image: [],
                            preview: null,
                            deleted: true,
                          };
                        });
                      }}
                    />
                  </div>
                  <div className="edit-photo">
                    <Image
                      src={Edit}
                      alt="Edit icon"
                      height={30}
                      onClick={() => {
                        document.getElementById("image-upload")?.click();
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="edit-photo">
                    <Image
                      src={Plus}
                      alt="Add icon"
                      height={30}
                      onClick={() => {
                        document.getElementById("image-upload")?.click();
                      }}
                    />
                  </div>
                </>
              )}
            </div>
            <input
              style={{ display: "none", appearance: "none" }}
              id="image-upload"
              type={"file"}
              accept={"image/*"}
              multiple={false}
              onChange={editImage}
            />
          </>
        )}
      </div>
      <div className="section-general l-1">
        <div className="col">
          <div className="label">First Name</div>
          {editState ? (
            <div className="input-block">
              <input
                className="details-edit"
                value={profileData?.firstName}
                onChange={(e: any) => {
                  if (e.nativeEvent.data !== " ") {
                    setError((prev: any) => {
                      return { ...prev, firstName: false };
                    });
                    setProfileData((prev: any) => {
                      return {
                        ...prev,
                        firstName: e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .replace(/[0-9]/g, ""),
                      };
                    });
                  }
                }}
              />
              {error?.firstName && (
                <div className="error">Please enter First name</div>
              )}
            </div>
          ) : (
            <div className="details">{profile?.firstName}</div>
          )}
        </div>
        <div className="col">
          <div className="label">Last Name</div>
          {editState ? (
            <div className="input-block">
              <input
                className="details-edit"
                value={profileData?.lastName}
                onChange={(e: any) => {
                  if (e.nativeEvent.data !== " ") {
                    setError((prev: any) => {
                      return { ...prev, lastName: false };
                    });
                    setProfileData((prev: any) => {
                      return {
                        ...prev,
                        lastName: e.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .replace(/[0-9]/g, ""),
                      };
                    });
                  }
                }}
              />
              {error?.lastName && (
                <div className="error">Please enter Last name</div>
              )}
            </div>
          ) : (
            <div className="details">{profile?.lastName}</div>
          )}
        </div>
      </div>
      <div className="section-general">
        <div className="label">E-mail</div>
        {editState ? (
          <>
            {profileData?.email ? profileData?.email : "NA"}
            <button type="button" className="google-button" onClick={getEmail}>
              Update with <span style={{ color: "#4285F4" }}>G</span>
              <span style={{ color: "#EA4335" }}>o</span>
              <span style={{ color: "#FBBC05" }}>o</span>
              <span style={{ color: "#4285F4" }}>g</span>
              <span style={{ color: "#34A853" }}>l</span>
              <span style={{ color: "#EA4335" }}>e</span>
            </button>
          </>
        ) : (
          <div className="details">
            {profile?.email ? profile?.email : "NA"}
          </div>
        )}
      </div>
      <div className="section-general">
        <div className="label">Phone number</div>
        {editState ? (
          <>
            {profileData?.phoneNumber}
            <button
              type="button"
              className="google-button"
              onClick={VerifyAndUpdatePhone}
            >
              Verify and update
            </button>
          </>
        ) : (
          <div className="details">{profile?.phoneNumber}</div>
        )}
      </div>
      <div className="section-general">
        {editState ? (
          <>
            <button
              type="button"
              className="cancel-edit"
              onClick={cancelProfileEdit}
            >
              Cancel
            </button>
            <button
              type="button"
              className="edit-profile"
              onClick={UpdateProfile}
              disabled={loading}
            >
              {loading ? <Loading className="dot-flashing" /> : "Update"}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="edit-profile"
            onClick={() => {
              setEditState(true);
            }}
          >
            Update profile
          </button>
        )}
      </div>
      <div className="header secondary">Address</div>
      <div className="section-general-address">
        {address === undefined ? (
          <>Loading...</>
        ) : (
          <>
            {address?.length < 6 && (
              <div className="add-address">
                <button
                  type="button"
                  className="add-address-button"
                  onClick={AddAddress}
                >
                  Add address
                </button>
              </div>
            )}
            {address?.length > 0 ? (
              <div className="address-array">
                {address?.map((i: any) => {
                  return <AddressItemCard address={i} />;
                })}
              </div>
            ) : (
              <div className="no-address">No address found!</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BasicDetails;
