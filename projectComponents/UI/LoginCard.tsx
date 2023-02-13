import React, { useEffect, useRef, useState } from "react";
import { messageService } from "../Functions/messageService";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  callApi,
  gSignInWithPopup,
  gSignOut,
  setLocalObjectData,
  setLocalStringData,
  setSessionObjectData,
} from "../Functions/util";
import { processIDs } from "../../config/processID";
import OTPField from "./OTPField";
import Loading from "./Loading";
import { storageConfig } from "../../config/siteConfig";
import { useRouter } from "next/router";
import { responseType } from "../../typings";
const LoginCard = () => {
  const [loginState, setLoginState] = useState("Login");
  const [loading, setLoading] = useState({
    loginPhone: false,
    loginMail: false,
    signupPhone: false,
    signupmMail: false,
    otpSend: false,
    otpVeri: false,
    resendOtp: false,
    createAcc: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    confPassword: "",
    email: "",
    otp: "",
  });
  const [error, setError] = useState({
    firstName: false,
    firstNameText: "",
    lastName: false,
    lastNameText: "",
    phone: false,
    phoneText: "",
    password: false,
    passwordText: "",
    otp: false,
    otpText: "",
    globalError: false,
    globalErrorText: "",
  });
  const [signUpStep, setSignUpStep] = useState(1);
  const [resendOtp, setResendOtp] = useState({
    state: false,
    timer: 59,
  });
  const timer = useRef<any>();
  const md5 = require("md5");
  const router = useRouter();
  const closePopUp = () => {
    messageService?.sendMessage(
      "login-card",
      // @ts-ignore
      { action: "close-popup" },
      "header"
    );
  };
  const startTimer = () => {
    timer.current = setInterval(() => {
      setResendOtp((prev: any) => {
        return { ...prev, timer: prev?.timer - 1 };
      });
    }, 1000);
  };
  const clickOutSide = (e: any) => {
    if (e.target.className === "modal") {
      closePopUp();
    }
  };
  const signInWithGoogle = () => {
    setLoading((prev: any) => {
      return { ...prev, loginMail: true };
    });
    gSignInWithPopup().then((res: any) => {
      gSignOut();
      callApi(processIDs?.user_login_with_email, {
        email: res?.user?.email,
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setSessionObjectData(
            storageConfig?.userProfile,
            res?.data?.returnData?.profileData
          );
          setLocalStringData(
            storageConfig?.jwtToken,
            res?.data?.returnData?.accessToken
          );
          messageService?.sendMessage(
            "login-card",
            // @ts-ignore
            { action: "refresh-profile" },
            "header"
          );
          setLoading((prev: any) => {
            return { ...prev, loginMail: false };
          });
          router.push("/");
          closePopUp();
        } else {
          setLoading((prev: any) => {
            return { ...prev, loginMail: false };
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
    });
  };
  const LoginUser = (e: any) => {
    e.preventDefault();
    if (
      formData?.password === "" ||
      formData?.phoneNumber === "" ||
      formData?.phoneNumber === undefined
    ) {
      if (formData?.password === "") {
        setError((prev: any) => {
          return {
            ...prev,
            password: true,
            passwordText: "Please enter password",
          };
        });
      }
      if (formData?.phoneNumber === "" || formData?.phoneNumber === undefined) {
        setError((prev: any) => {
          return {
            ...prev,
            phone: true,
            phoneText: "Please enter phone number",
          };
        });
      }
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
        return { ...prev, loginPhone: true };
      });
      callApi(processIDs?.user_login_with_phone, {
        phone: formData?.phoneNumber,
        password: md5(formData?.password),
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setLocalStringData(
            storageConfig?.jwtToken,
            res?.data?.returnData?.accessToken
          );
          setSessionObjectData(
            storageConfig?.userProfile,
            res?.data?.returnData?.profileData
          );
          messageService?.sendMessage(
            "login-card",
            // @ts-ignore
            { action: "refresh-profile" },
            "header"
          );
          setLoading((prev: any) => {
            return { ...prev, loginPhone: false };
          });
          router.push("/");
          closePopUp();
        } else {
          setLoading((prev: any) => {
            return { ...prev, loginPhone: false };
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
    }
  };
  const SignupUser = (e: any) => {
    e.preventDefault();
    if (
      formData?.firstName === "" ||
      formData?.lastName === "" ||
      formData?.phoneNumber === "" ||
      formData?.phoneNumber === undefined
    ) {
      if (formData?.firstName === "") {
        setError((prev: any) => {
          return {
            ...prev,
            firstName: true,
            firstNameText: "Please enter first name",
          };
        });
      }
      if (formData?.lastName === "") {
        setError((prev: any) => {
          return {
            ...prev,
            lastName: true,
            lastNameText: "Please enter last name",
          };
        });
      }
      if (formData?.phoneNumber === "" || formData?.phoneNumber === undefined) {
        setError((prev: any) => {
          return {
            ...prev,
            phone: true,
            phoneText: "Please enter phone number",
          };
        });
      }
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
        return { ...prev, signupPhone: true };
      });
      callApi(processIDs?.user_phone_check, {
        phoneNumber: formData?.phoneNumber,
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          callApi(processIDs?.phone_verify, {
            phone: formData?.phoneNumber,
          }).then((res: responseType) => {
            setLoading((prev: any) => {
              return { ...prev, signupPhone: false };
            });
            setSignUpStep(3);
          });
        } else {
          setLoading((prev: any) => {
            return { ...prev, signupPhone: false };
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
    }
  };
  const signUpWithGoogle = () => {
    setLoading((prev: any) => {
      return { ...prev, signupmMail: true };
    });
    setError((prev: any) => {
      return { ...prev, globalError: false, globalErrorText: "" };
    });
    gSignInWithPopup().then((res: any) => {
      gSignOut();
      callApi(processIDs?.user_email_check, {
        firstName: res?.user?.displayName?.split(" ")[0].toString(),
        lastName: res?.user?.displayName?.split(" ")[1].toString(),
        email: res?.user?.email,
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setFormData((prev: any) => {
            return {
              ...prev,
              firstName: res?.data?.returnData?.firstName,
              lastName: res?.data?.returnData?.lastName,
              email: res?.data?.returnData?.email,
            };
          });
          setLoading((prev: any) => {
            return { ...prev, signupmMail: false };
          });
          setSignUpStep(2);
        } else {
          setLoading((prev: any) => {
            return { ...prev, signupmMail: false };
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
    });
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
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          callApi(processIDs?.phone_verify, {
            phone: formData?.phoneNumber,
          }).then((res: responseType) => {
            if (res?.data?.returnCode) {
              setLoading((prev: any) => {
                return { ...prev, otpSend: false };
              });
              setSignUpStep(3);
            } else {
              setLoading((prev: any) => {
                return { ...prev, otpSend: false };
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
        } else {
          setLoading((prev: any) => {
            return { ...prev, otpSend: false };
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
      }).then((res: responseType) => {
        if (res?.data?.returnCode) {
          setLoading((prev: any) => {
            return { ...prev, otpVeri: false };
          });
          setSignUpStep(4);
        } else {
          setLoading((prev: any) => {
            return { ...prev, otpVeri: false };
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
    }
  };

  const createAccount = (e: any) => {
    e.preventDefault();
    if (formData?.password === "") {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Please enter a password",
        };
      });
    } else if (formData?.confPassword === "") {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Please confirm your password",
        };
      });
    } else if (formData?.confPassword !== formData?.password) {
      setError((prev: any) => {
        return {
          ...prev,
          globalError: true,
          globalErrorText: "Confirmed password doesn't match!",
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
    } else {
      setLoading((prev: any) => {
        return { ...prev, createAcc: true };
      });
      callApi(processIDs?.create_new_account, {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        phoneNumber: formData?.phoneNumber,
        email: formData?.email,
        password: md5(formData?.password),
      })
        .then((res: responseType) => {
          if (res?.data?.returnCode) {
            closePopUp();
          } else {
            setLoading((prev: any) => {
              return { ...prev, createAcc: false };
            });
            setError((prev: any) => {
              return {
                ...prev,
                globalError: true,
                globalErrorText: res?.data?.msg,
              };
            });
          }
        })
        .catch((err: any) => {
          setLoading((prev: any) => {
            return { ...prev, createAcc: false };
          });
          console.log(err);
        });
    }
  };

  const resendOTP = () => {
    setLoading((prev: any) => {
      return { ...prev, resendOtp: true };
    });
    callApi(processIDs?.phone_verify, {
      phone: formData?.phoneNumber,
    }).then((res: responseType) => {
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
    });
  };

  const ForgotPassword = () => {
    messageService?.sendMessage(
      "login-card",
      // @ts-ignore
      { action: "forgot-password" },
      "header"
    );
  };

  const switchPage = () => {
    setError((prev: any) => {
      return {
        ...prev,
        firstName: false,
        firstNameText: "",
        lastName: false,
        lastNameText: "",
        phone: false,
        phoneText: "",
        password: false,
        passwordText: "",
        globalError: false,
        globalErrorText: "",
        otp: false,
        otpText: "",
      };
    });
    setFormData((prev: any) => {
      return {
        ...prev,
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        email: "",
        otp: "",
        confPassword: "",
      };
    });
    setSignUpStep(1);
    setLoading((prev: any) => {
      return {
        ...prev,
        loginPhone: false,
        loginMail: false,
        signupPhone: false,
        signupmMail: false,
        otpSend: false,
        otpVeri: false,
        resendOtp: false,
      };
    });
  };

  useEffect(() => {
    if (signUpStep === 3) {
      setResendOtp((prev: any) => {
        return {
          ...prev,
          state: false,
          timer: 59,
        };
      });
      startTimer();
    }
  }, [signUpStep]);

  useEffect(() => {
    if (resendOtp?.timer === 0) {
      clearInterval(timer.current);
      setResendOtp((prev: any) => {
        return { ...prev, timer: 59, state: true };
      });
    }
  }, [resendOtp]);
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="login-card">
        {loginState === "Login" && (
          <>
            <form onSubmit={LoginUser}>
              {error?.globalError && (
                <div className="error globalError">
                  {error?.globalErrorText}
                </div>
              )}
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

              <div className="form-label">Password</div>
              <div className="form-input">
                <input
                  type={"password"}
                  value={formData?.password}
                  autoComplete={"off"}
                  placeholder="Password"
                  onChange={(e: any) => {
                    if (e.nativeEvent.data !== " ") {
                      setError((prev: any) => {
                        return {
                          ...prev,
                          password: false,
                          passwordText: "",
                          globalError: false,
                          globalErrorText: "",
                        };
                      });
                      setFormData((prev: any) => {
                        return { ...prev, password: e.target.value };
                      });
                    }
                  }}
                />
                {error?.password && (
                  <div className="error">{error?.passwordText}</div>
                )}
              </div>
              <div className="forgot-password">
                <span className="forgot-password-text" onClick={ForgotPassword}>
                  Forgot password?
                </span>
              </div>
              <div className="form-input">
                <button type="submit" className="login-button">
                  {loading?.loginPhone ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    <>Log in</>
                  )}
                </button>
              </div>
              <div className="or">Or</div>
            </form>
            <button
              type="button"
              className="google-button"
              onClick={signInWithGoogle}
            >
              {loading?.loginMail ? (
                <Loading className="dot-flashing" />
              ) : (
                <>
                  Sign in with <span style={{ color: "#4285F4" }}>G</span>
                  <span style={{ color: "#EA4335" }}>o</span>
                  <span style={{ color: "#FBBC05" }}>o</span>
                  <span style={{ color: "#4285F4" }}>g</span>
                  <span style={{ color: "#34A853" }}>l</span>
                  <span style={{ color: "#EA4335" }}>e</span>
                </>
              )}
            </button>
            <div className="sign-up-text">
              Don&apos;t have an account?{" "}
              <span
                className="sign-up-link"
                onClick={() => {
                  switchPage();
                  setLoginState("Signup");
                }}
              >
                Sign up
              </span>
            </div>
          </>
        )}
        {loginState === "Signup" && (
          <>
            {signUpStep === 1 && (
              <>
                <form onSubmit={SignupUser}>
                  {error?.globalError && (
                    <div className="error globalError">
                      {error?.globalErrorText}
                    </div>
                  )}
                  <div className="form-label">First name</div>
                  <div className="form-input">
                    <input
                      type={"text"}
                      value={formData?.firstName}
                      autoComplete={"off"}
                      maxLength={15}
                      placeholder={"First name"}
                      onChange={(e: any) => {
                        setError((prev: any) => {
                          return {
                            ...prev,
                            firstName: false,
                            firstNameText: "",
                            globalError: false,
                            globalErrorText: "",
                          };
                        });
                        if (e.nativeEvent.data !== " ") {
                          setFormData((prev: any) => {
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
                      <div className="error">{error?.firstNameText}</div>
                    )}
                  </div>
                  <div className="form-label">Last name</div>
                  <div className="form-input">
                    <input
                      type={"text"}
                      value={formData?.lastName}
                      autoComplete={"off"}
                      maxLength={15}
                      placeholder={"Last name"}
                      onChange={(e: any) => {
                        setError((prev: any) => {
                          return {
                            ...prev,
                            lastName: false,
                            lastNameText: "",
                            globalError: false,
                            globalErrorText: "",
                          };
                        });
                        if (e.nativeEvent.data !== " ") {
                          setFormData((prev: any) => {
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
                      <div className="error">{error?.lastNameText}</div>
                    )}
                  </div>
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
                      {loading?.signupPhone ? (
                        <Loading className="dot-flashing" />
                      ) : (
                        <>Sign up</>
                      )}
                    </button>
                  </div>
                  <div className="or">Or</div>
                </form>
                <button
                  type="button"
                  className="google-button"
                  onClick={signUpWithGoogle}
                >
                  {loading?.signupmMail ? (
                    <Loading className="dot-flashing" />
                  ) : (
                    <>
                      Sign up with <span style={{ color: "#4285F4" }}>G</span>
                      <span style={{ color: "#EA4335" }}>o</span>
                      <span style={{ color: "#FBBC05" }}>o</span>
                      <span style={{ color: "#4285F4" }}>g</span>
                      <span style={{ color: "#34A853" }}>l</span>
                      <span style={{ color: "#EA4335" }}>e</span>
                    </>
                  )}
                </button>
              </>
            )}
            {signUpStep === 2 && (
              <>
                <div className="greetings">Hi {formData?.firstName}!</div>
                {error?.globalError && (
                  <div className="error globalError">
                    {error?.globalErrorText}
                  </div>
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
            {signUpStep === 3 && (
              <>
                <div className="greetings">Hi {formData?.firstName}!</div>
                {error?.globalError && (
                  <div className="error globalError">
                    {error?.globalErrorText}
                  </div>
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
            {signUpStep === 4 && (
              <>
                <div className="greetings">Create password</div>
                {error?.globalError && (
                  <div className="error globalError">
                    {error?.globalErrorText}
                  </div>
                )}
                <form onSubmit={createAccount}>
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
                      {loading?.createAcc ? (
                        <Loading className="dot-flashing" />
                      ) : (
                        <>Create account</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            <div className="sign-up-text">
              Already have an account?{" "}
              <span
                className="sign-up-link"
                onClick={() => {
                  switchPage();
                  setLoginState("Login");
                }}
              >
                Log in
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginCard;
