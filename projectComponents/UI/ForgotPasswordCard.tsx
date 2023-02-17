import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { responseType } from "../../typings";
import { messageService } from "../Functions/messageService";
import { callApi } from "../Functions/util";
import Loading from "./Loading";
import OTPField from "./OTPField";

const ForgotPasswordCard = () => {
  const timer = useRef<any>();
  const md5 = require("md5");
  const [steps, setSteps] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    password: "",
    confPassword: "",
  });
  const [loading, setLoading] = useState({
    otpSend: false,
    otpVeri: false,
    resendOtp: false,
    changePass: false,
  });
  const [error, setError] = useState({
    phone: false,
    phoneText: "",
    otp: false,
    otpText: "",
    globalError: false,
    globalErrorText: "",
  });
  const [resendOtp, setResendOtp] = useState({
    state: false,
    timer: 59,
  });
  const closePopUp = () => {
    messageService?.sendMessage(
      "forgot-password-card",
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
  const phoneVerify = (e: any) => {
    e.preventDefault();
    if (formData?.phoneNumber === "" || formData?.phoneNumber === undefined) {
      setError((prev: any) => {
        return {
          ...prev,
          phone: true,
          phoneText: "Please enter phone number",
        };
      });
    } else if (formData?.phoneNumber?.length < 13) {
      setError((prev: any) => {
        return {
          ...prev,
          phone: true,
          phoneText: "Please enter 10 digit phone number",
        };
      });
    } else {
      setLoading((prev: any) => {
        return { ...prev, otpSend: true };
      });
      callApi(processIDs?.user_phone_check, {
        phoneNumber: formData?.phoneNumber,
        // @ts-ignore
      }).then((res: responseType) => {
        if (res?.status === 200) {
          if (!res?.data?.returnCode) {
            callApi(processIDs?.phone_verify, {
              phone: formData?.phoneNumber,
              // @ts-ignore
            }).then((res: responseType) => {
              setLoading((prev: any) => {
                return { ...prev, otpSend: false };
              });
              if (res?.status === 200) {
                if (res?.data?.returnCode) {
                  setSteps(2);
                } else {
                  setError((prev: any) => {
                    return {
                      ...prev,
                      globalError: true,
                      globalErrorText: res?.data?.msg,
                    };
                  });
                }
              } else {
                toast.error(`Error: ${res?.status}`);
              }
            });
          } else {
            setLoading((prev: any) => {
              return { ...prev, otpSend: false };
            });
            setError((prev: any) => {
              return {
                ...prev,
                globalError: true,
                globalErrorText: "User not found!",
              };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setLoading((prev: any) => {
            return { ...prev, otpSend: false };
          });
        }
      });
    }
  };
  const OTPVerify = (e: any) => {
    e.preventDefault();
    if (formData?.otp === "") {
      setError((prev: any) => {
        return {
          ...prev,
          otp: true,
          otpText: "Please enter OTP",
        };
      });
    } else if (formData?.otp?.length < 6) {
      setError((prev: any) => {
        return {
          ...prev,
          otp: true,
          otpText: "Please enter 6 digit OTP",
        };
      });
    } else {
      setLoading((prev: any) => {
        return { ...prev, otpVeri: true };
      });
      callApi(processIDs?.otp_verify, {
        phone: formData?.phoneNumber,
        otp: formData?.otp,
        // @ts-ignore
      }).then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            setLoading((prev: any) => {
              return { ...prev, otpVeri: false };
            });
            setSteps(3);
          } else {
            setLoading((prev: any) => {
              return { ...prev, otpVeri: false };
            });
            setError((prev: any) => {
              return {
                ...prev,
                otp: true,
                otpText: res?.data?.msg,
              };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setLoading((prev: any) => {
            return { ...prev, otpVeri: false };
          });
          setError((prev: any) => {
            return {
              ...prev,
              otp: true,
              otpText: res?.data?.msg,
            };
          });
        }
      });
    }
  };
  const changePassword = (e: any) => {
    e.preventDefault();
    if (formData?.password === "") {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Please enter new password",
        };
      });
    } else if (formData?.confPassword === "") {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Please confirm new password",
        };
      });
    } else if (formData?.password?.length < 8) {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Password must be 8 characters long!",
        };
      });
    } else if (formData?.password !== formData?.confPassword) {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Confirmed password doesn't match!",
        };
      });
    } else {
      setLoading((prev: any) => {
        return { ...prev, changePass: true };
      });
      callApi(processIDs?.forgot_password, {
        phoneNumber: formData?.phoneNumber,
        newPass: md5(formData?.confPassword),
        // @ts-ignore
      }).then((res: responseType) => {
        setLoading((prev: any) => {
          return { ...prev, changePass: false };
        });
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            closePopUp();
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      });
    }
  };
  const startTimer = () => {
    timer.current = setInterval(() => {
      setResendOtp((prev: any) => {
        return { ...prev, timer: prev?.timer - 1 };
      });
    }, 1000);
  };
  useEffect(() => {
    if (steps === 2) {
      setResendOtp((prev: any) => {
        return {
          ...prev,
          state: false,
          timer: 59,
        };
      });
      startTimer();
    }
  }, [steps]);
  useEffect(() => {
    if (resendOtp?.timer === 0) {
      clearInterval(timer.current);
      setResendOtp((prev: any) => {
        return { ...prev, timer: 59, state: true };
      });
    }
  }, [resendOtp]);
  const resendOTP = () => {
    setLoading((prev: any) => {
      return { ...prev, resendOtp: true };
    });
    callApi(processIDs?.phone_verify, {
      phone: formData?.phoneNumber,
      // @ts-ignore
    }).then((res: responseType) => {
      if (res?.status === 200) {
        if (res?.data?.returnCode) {
          setLoading((prev: any) => {
            return { ...prev, resendOtp: false };
          });
          setResendOtp((prev: any) => {
            return {
              ...prev,
              state: false,
            };
          });
          startTimer();
        } else {
          setLoading((prev: any) => {
            return { ...prev, resendOtp: false };
          });
          setError((prev: any) => {
            return {
              ...prev,
              globalError: true,
              globalErrorText: res?.data?.msg,
            };
          });
        }
      } else {
        toast.error(`Error: ${res?.status}`);
        setLoading((prev: any) => {
          return { ...prev, resendOtp: false };
        });
        setError((prev: any) => {
          return {
            ...prev,
            globalError: true,
            globalErrorText: res?.data?.msg,
          };
        });
      }
    });
  };
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="forgot-password-card">
        {steps === 1 && (
          <>
            <div className="header">Please Enter your phone number</div>
            {error?.globalError && (
              <div className="error globalError">{error?.globalErrorText}</div>
            )}
            <form onSubmit={phoneVerify}>
              <div className="form-label">Phone number</div>
              <div className="form-input">
                <PhoneInput
                  defaultCountry={"IN"}
                  addInternationalOption={false}
                  autoComplete={"off"}
                  limitMaxLength={true}
                  maxLength={11}
                  countries={["IN"]}
                  placeholder="Enter phone number"
                  value={formData?.phoneNumber}
                  onChange={(e: any) => {
                    setError((prev: any) => {
                      return {
                        ...prev,
                        phone: false,
                        phoneText: "",
                        globalError: false,
                        globalErrorText: "",
                      };
                    });
                    setFormData((prev: any) => {
                      return { ...prev, phoneNumber: e };
                    });
                  }}
                />
                {error?.phone && (
                  <div className="error">{error?.phoneText}</div>
                )}
              </div>
              <div className="form-input">
                <button type="submit" className="login-button">
                  {loading?.otpSend ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    <>Verify phone number</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
        {steps === 2 && (
          <>
            <div className="header">Please Enter OTP</div>
            {error?.globalError && (
              <div className="error globalError">{error?.globalErrorText}</div>
            )}
            <form onSubmit={OTPVerify}>
              <div className="form-label">
                We have sent an OTP to {formData?.phoneNumber}
              </div>
              <div className="form-input">
                <OTPField setValue={setFormData} setError={setError} />
                {error?.otp && (
                  <div className="error otp-error">{error?.otpText}</div>
                )}
              </div>
              <div className="form-input">
                <button type="submit" className="login-button">
                  {loading?.otpVeri ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    <>Verify OTP</>
                  )}
                </button>
              </div>
              <div className="form-input resend-otp">
                {resendOtp?.state ? (
                  <div className="resend-otp-link" onClick={resendOTP}>
                    {loading?.resendOtp ? (
                      <Loading className="dot-flashing" />
                    ) : (
                      <>Resend OTP</>
                    )}
                  </div>
                ) : (
                  <>Resend OTP in {resendOtp?.timer}s</>
                )}
              </div>
            </form>
          </>
        )}
        {steps === 3 && (
          <>
            <div className="header">Enter new password</div>
            {error?.globalError && (
              <div className="error globalError">{error?.globalErrorText}</div>
            )}
            <form onSubmit={changePassword}>
              <div className="form-label">New Password</div>
              <div className="form-input">
                <input
                  type={"password"}
                  value={formData?.password}
                  onChange={(e: any) => {
                    setError((prev: any) => {
                      return {
                        ...prev,
                        globalError: false,
                        globalErrorText: "",
                      };
                    });
                    setFormData((prev: any) => {
                      return { ...prev, password: e.target.value };
                    });
                  }}
                />
              </div>
              <div className="form-label">Confirm Password</div>
              <div className="form-input">
                <input
                  type={"password"}
                  value={formData?.confPassword}
                  onChange={(e: any) => {
                    setError((prev: any) => {
                      return {
                        ...prev,
                        globalError: false,
                        globalErrorText: "",
                      };
                    });
                    setFormData((prev: any) => {
                      return { ...prev, confPassword: e.target.value };
                    });
                  }}
                />
              </div>
              <div className="form-input">
                <button type="submit" className="login-button">
                  {loading?.changePass ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    <>Change Password</>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordCard;
