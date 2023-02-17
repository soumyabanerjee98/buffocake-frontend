import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import { storageConfig } from "../../../config/siteConfig";
import { responseType } from "../../../typings";
import { messageService } from "../../Functions/messageService";
import {
  callApi,
  getLocalObjectData,
  getSessionObjectData,
} from "../../Functions/util";
import Loading from "../../UI/Loading";

const Security = () => {
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
        // @ts-ignore
      }).then((res: responseType) => {
        if (res?.status === 200) {
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
        } else {
          toast.error(`Error: ${res?.status}`);
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

export default Security;
