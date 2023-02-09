import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { serverConfig, storageConfig } from "../../config/siteConfig";
import { messageService } from "../Functions/messageService";
import {
  callApi,
  getSessionObjectData,
  gSignInWithPopup,
  gSignOut,
  setSessionObjectData,
  uploadImage,
} from "../Functions/util";
import PhoneVerifyCard from "../UI/PhoneVerifyCard";
import Avatar from "../Assets/Images/user.png";
import Edit from "../Assets/Images/edit.png";
import Delete from "../Assets/Images/delete.png";
import Plus from "../Assets/Images/plus.png";
import { responseType } from "../../typings";
import { processIDs } from "../../config/processID";
import Loading from "../UI/Loading";

export type ProfileProps = {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePhoto: any;
  };
};

const Profile = (props: ProfileProps) => {
  const { profile } = props;
  const url =
    process.env.NODE_ENV === "production"
      ? serverConfig?.backend_url_server
      : serverConfig?.backend_url_test;
  const sectionArr = ["General", "Security"];
  const [section, setSection] = useState(
    sectionArr.map((i: string, idx: number) => {
      if (idx === 0) {
        return { id: idx, type: i, active: true };
      }
      return { id: idx, type: i, active: false };
    })
  );
  const sectionSelect = (id: number) => {
    setSection(
      section.map((v: any, idx: number) => {
        if (id === idx) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      })
    );
  };
  const Logout = () => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      { action: "logout" },
      "global"
    );
  };

  // General ********************

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

  const cancelProfileEdit = () => {
    setLoading(false);
    setEditState(false);
    setError((prev: any) => {
      return { ...prev, firstName: false, lastName: false, phoneNumber: false };
    });
    setImage((prev: any) => {
      return { ...prev, deleted: false, image: [], preview: null };
    });
  };
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
          }).then((res: responseType) => {
            if (res?.data?.returnCode) {
              // @ts-ignore
              uploadImage(image?.image).then((res: responseType) => {
                callApi(processIDs?.update_user, {
                  id: getSessionObjectData(storageConfig?.userProfile)?.id,
                  firstName: profileData?.firstName,
                  lastName: profileData?.lastName,
                  phoneNumber: profileData?.phoneNumber,
                  email: profileData?.email,
                  profilePhoto: res?.data?.returnData[0]?.path,
                }).then((res: responseType) => {
                  if (res?.data?.returnCode) {
                    refreshUser(res?.data?.returnData?.profile);
                  }
                  setLoading(false);
                });
              });
            } else {
              setLoading(false);
            }
          });
        } else {
          // @ts-ignore
          uploadImage(image?.image).then((res: responseType) => {
            callApi(processIDs?.update_user, {
              id: getSessionObjectData(storageConfig?.userProfile)?.id,
              firstName: profileData?.firstName,
              lastName: profileData?.lastName,
              phoneNumber: profileData?.phoneNumber,
              email: profileData?.email,
              profilePhoto: res?.data?.returnData[0]?.path,
            }).then((res: responseType) => {
              if (res?.data?.returnCode) {
                refreshUser(res?.data?.returnData?.profile);
              }
              setLoading(false);
            });
          });
        }
      } else if (image?.deleted) {
        callApi(processIDs?.delete_photo, {
          mediaPath: profile?.profilePhoto,
        }).then((res: responseType) => {
          if (res?.data?.returnCode) {
            callApi(processIDs?.update_user, {
              id: getSessionObjectData(storageConfig?.userProfile)?.id,
              firstName: profileData?.firstName,
              lastName: profileData?.lastName,
              phoneNumber: profileData?.phoneNumber,
              email: profileData?.email,
              profilePhoto: null,
            }).then((res: responseType) => {
              if (res?.data?.returnCode) {
                refreshUser(res?.data?.returnData?.profile);
              }
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        });
      } else {
        callApi(processIDs?.update_user, {
          id: getSessionObjectData(storageConfig?.userProfile)?.id,
          firstName: profileData?.firstName,
          lastName: profileData?.lastName,
          phoneNumber: profileData?.phoneNumber,
          email: profileData?.email,
          profilePhoto: profile?.profilePhoto,
        }).then((res: responseType) => {
          if (res?.data?.returnCode) {
            refreshUser(res?.data?.returnData?.profile);
          }
          setLoading(false);
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

  const BasicDetails = () => {
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
              <button
                type="button"
                className="google-button"
                onClick={getEmail}
              >
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
      </>
    );
  };

  // ************************
  // Security *****************
  const [passwordInput, setPasswordInput] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [passwordDetails, setPasswordDetails] = useState({
    oldPass: "",
    newPass: "",
    confPass: "",
  });
  const [errorSecurity, setErrorSecurity] = useState({
    oldPass: false,
    oldPassText: "",
    newPass: false,
    newPassText: "",
    confPass: false,
    confPassTxt: "",
  });
  const oldPassRef = useRef<any>();
  const md5 = require("md5");
  const passwordChangeHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordDetails?.oldPass === "") {
      setErrorSecurity((prev: any) => {
        return {
          ...prev,
          oldPass: true,
          oldPassText: "Please enter old password",
        };
      });
    } else if (passwordDetails?.newPass === "") {
      setErrorSecurity((prev: any) => {
        return {
          ...prev,
          newPass: true,
          newPassText: "Please enter new password",
        };
      });
    } else if (passwordDetails?.confPass === "") {
      setErrorSecurity((prev: any) => {
        return {
          ...prev,
          confPass: true,
          confPassTxt: "Please confirm new password",
        };
      });
    } else if (passwordDetails?.newPass?.length < 8) {
      setErrorSecurity((prev: any) => {
        return {
          ...prev,
          newPass: true,
          newPassText: "Password must be 8 characters long!",
        };
      });
    } else if (passwordDetails?.newPass !== passwordDetails?.confPass) {
      setErrorSecurity((prev: any) => {
        return {
          ...prev,
          confPass: true,
          confPassTxt: "Confirmed password doesn't match!",
        };
      });
    } else {
      setLoadingSecurity(true);
      callApi(processIDs?.change_password, {
        id: getSessionObjectData(storageConfig?.userProfile)?.id,
        oldPass: md5(passwordDetails?.oldPass),
        newPass: md5(passwordDetails?.newPass),
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          cancelChangePassword();
        } else {
          setLoadingSecurity(false);
          setErrorSecurity((prev: any) => {
            return {
              ...prev,
              oldPass: true,
              oldPassText: res?.data?.msg,
            };
          });
        }
      });
    }
  };

  const cancelChangePassword = () => {
    setPasswordInput(false);
    setLoadingSecurity(false);
    setPasswordDetails((prev: any) => {
      return { ...prev, oldPass: "", newPass: "", confPass: "" };
    });
    setErrorSecurity((prev: any) => {
      return {
        ...prev,
        oldPass: false,
        newPass: false,
        confPass: false,
        oldPassText: "",
        newPassText: "",
        confPassTxt: "",
      };
    });
  };

  const ForgotPassword = () => {
    messageService?.sendMessage(
      "profile-page",
      // @ts-ignore
      { action: "forgot-password" },
      "header"
    );
  };

  useEffect(() => {
    if (passwordInput) {
      oldPassRef.current.focus();
    }
  }, [passwordInput]);

  const Security = () => {
    return (
      <>
        <div className="header">Change Password</div>
        <hr />
        <form onSubmit={passwordChangeHandler}>
          <div className="section-security">
            <div className="label">Old Password</div>
            <input
              type={"password"}
              className="form-input"
              disabled={!passwordInput}
              value={passwordDetails?.oldPass}
              onChange={(e: any) => {
                setErrorSecurity((prev: any) => {
                  return {
                    ...prev,
                    oldPass: false,
                    oldPassText: "",
                  };
                });
                setPasswordDetails((prev: any) => {
                  return { ...prev, oldPass: e.target.value.trim() };
                });
              }}
              ref={oldPassRef}
            />
            {errorSecurity?.oldPass && (
              <div className="error">{errorSecurity?.oldPassText}</div>
            )}
          </div>
          <div className="section-security">
            <div className="label">New Password</div>
            <input
              type={"password"}
              className="form-input"
              disabled={!passwordInput}
              value={passwordDetails?.newPass}
              onChange={(e: any) => {
                setErrorSecurity((prev: any) => {
                  return {
                    ...prev,
                    newPass: false,
                    newPassText: "",
                  };
                });
                setPasswordDetails((prev: any) => {
                  return { ...prev, newPass: e.target.value.trim() };
                });
              }}
            />
            {errorSecurity?.newPass && (
              <div className="error">{errorSecurity?.newPassText}</div>
            )}
          </div>
          <div className="section-security">
            <div className="label">Confirm Password</div>
            <input
              type={"password"}
              className="form-input"
              disabled={!passwordInput}
              value={passwordDetails?.confPass}
              onChange={(e: any) => {
                setErrorSecurity((prev: any) => {
                  return {
                    ...prev,
                    confPass: false,
                    confPassTxt: "",
                  };
                });
                setPasswordDetails((prev: any) => {
                  return { ...prev, confPass: e.target.value.trim() };
                });
              }}
            />
            {errorSecurity?.confPass && (
              <div className="error">{errorSecurity?.confPassTxt}</div>
            )}
          </div>
          <div className="section-security">
            <div className="forgot-password" onClick={ForgotPassword}>
              Forgot Password?
            </div>
          </div>
          <div className="section-security">
            {passwordInput ? (
              <div className="button-section">
                <button
                  type="button"
                  className="cancel-change-password-button"
                  onClick={cancelChangePassword}
                >
                  Cancel
                </button>
                <button type="submit" className="change-password-button">
                  {loadingSecurity ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    "Change"
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="change-password-button"
                onClick={() => {
                  setPasswordInput(true);
                }}
              >
                Change Password
              </button>
            )}
          </div>
        </form>
      </>
    );
  };

  // ***********************

  const SectionRender = () => {
    let active: number = NaN;
    section?.map((i: any) => {
      if (i?.active) {
        active = i?.id;
      }
    });
    switch (active) {
      case 0:
        return BasicDetails();
        break;
      case 1:
        return Security();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    messageService?.onReceive()?.subscribe((m: any) => {
      if (m?.sender === "phone-verify-card") {
        if (m?.message?.action === "success-verify") {
          setProfileData((prev: any) => {
            return { ...prev, phoneNumber: m?.message?.params };
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    cancelProfileEdit();
    cancelChangePassword();
  }, [section]);

  return (
    <div className="profile-screen">
      <div className="left-col">
        {section?.map((i: any, idx: number) => (
          <div
            key={`profile-section-${idx}`}
            className={`section ${i?.active ? "active" : ""}`}
            onClick={() => {
              sectionSelect(i?.id);
            }}
          >
            {i?.type}
          </div>
        ))}
        <div className="logout-container">
          <button type="button" className="logout" onClick={Logout}>
            Log out
          </button>
        </div>
      </div>
      <div className="right-col">{SectionRender()}</div>
    </div>
  );
};

export default Profile;
