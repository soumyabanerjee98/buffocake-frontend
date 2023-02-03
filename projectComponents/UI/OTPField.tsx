import React, { useEffect, useRef, useState } from "react";

export type OTPFieldProps = {
  setValue: any;
  setError: any;
};

const OTPField = (props: OTPFieldProps) => {
  const { setValue, setError } = props;
  const [otpDigits, setOtpDigits] = useState({
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
    field6: "",
  });
  const ipRef1 = useRef<any>();
  const ipRef2 = useRef<any>();
  const ipRef3 = useRef<any>();
  const ipRef4 = useRef<any>();
  const ipRef5 = useRef<any>();
  const ipRef6 = useRef<any>();
  useEffect(() => {
    setError((prev: any) => {
      return {
        ...prev,
        otp: false,
        otpText: "",
        globalError: false,
        globalErrorText: "",
      };
    });
    setValue((prev: any) => {
      return {
        ...prev,
        otp: `${otpDigits?.field1}${otpDigits?.field2}${otpDigits?.field3}${otpDigits?.field4}${otpDigits?.field5}${otpDigits?.field6}`.replaceAll(
          " ",
          ""
        ),
      };
    });
  }, [otpDigits]);
  return (
    <div className="otp-field">
      <input
        type={"number"}
        ref={ipRef1}
        value={otpDigits?.field1}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field1: e.nativeEvent.data,
            };
          });
          ipRef2?.current.focus();
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field1: "",
              };
            });
          }
        }}
      />
      <input
        type={"number"}
        ref={ipRef2}
        value={otpDigits?.field2}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field2: e.nativeEvent.data,
            };
          });
          ipRef3?.current.focus();
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field2: "",
              };
            });
          }
        }}
      />
      <input
        type={"number"}
        ref={ipRef3}
        value={otpDigits?.field3}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field3: e.nativeEvent.data,
            };
          });
          ipRef4?.current.focus();
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field3: "",
              };
            });
          }
        }}
      />
      <input
        type={"number"}
        ref={ipRef4}
        value={otpDigits?.field4}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field4: e.nativeEvent.data,
            };
          });
          ipRef5?.current.focus();
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field4: "",
              };
            });
          }
        }}
      />
      <input
        type={"number"}
        ref={ipRef5}
        value={otpDigits?.field5}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field5: e.nativeEvent.data,
            };
          });
          ipRef6?.current.focus();
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field5: "",
              };
            });
          }
        }}
      />
      <input
        type={"number"}
        ref={ipRef6}
        value={otpDigits?.field6}
        onChange={(e: any) => {
          setOtpDigits((prev: any) => {
            return {
              ...prev,
              field6: e.nativeEvent.data,
            };
          });
        }}
        onKeyDown={(e: any) => {
          if (e.key === "Backspace") {
            setOtpDigits((prev: any) => {
              return {
                ...prev,
                field6: "",
              };
            });
          }
        }}
      />
    </div>
  );
};

export default OTPField;
