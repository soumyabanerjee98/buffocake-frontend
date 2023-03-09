import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useSwr from "swr";
import { processIDs } from "../../../config/processID";
import { callApi } from "../../Functions/util";
// @ts-ignore
import Calendar from "react-calendar";
import Select from "react-select";
import "react-calendar/dist/Calendar.css";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  labelConfig,
  productConfig,
  serverConfig,
} from "../../../config/siteConfig";
import moment from "moment";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_all_products, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            return [];
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          return [];
        }
      }
    )
    .catch((err: any) => {
      toast.error(`Error: ${err?.message}`);
      return [];
    });
  return data;
};

const ManageOfflineOrders = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const [filterProduct, setFilterProduct] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [order, setOrder] = useState([]);
  const [address, setAddress] = useState({
    receiverName: "",
    receiverContact: "",
    house: "",
    street: "",
    pin: "",
  });
  const [grandTotal, setGrandTotal] = useState(0);
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 8);
  minDate.setDate(minDate.getDate() + 1);
  const {
    data: allProd,
    isLoading,
    error,
  } = useSwr("manage-offline-orders", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const FindProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    setSelectedItem({});
    setSearchTxt(text);
    if (text === "") {
      setFilterProduct([]);
    } else {
      let arr: any = [];
      allProd?.map((i: any) => {
        let searchTitle = i?.title
          ?.toLowerCase()
          ?.search(e.target.value?.toLowerCase());
        let searchId = i?._id
          ?.toLowerCase()
          ?.search(e.target.value?.toLowerCase());
        if (searchTitle !== -1 || searchId !== -1) {
          arr.push(i);
        }
      });
      setFilterProduct(
        arr?.filter((i: any, ind: number) => {
          return ind <= 4;
        })
      );
    }
  };
  const SelectProduct = (item: any) => {
    setSearchTxt(item?.title);
    setFilterProduct([]);
    let itemObj = {
      id: item?._id,
      productName: item?.title,
      availableWeights: item?.weight,
      availableFlavours: item?.availableFlavours,
      availableGourmets: item?.gourmetOptions,
      messageLimit: productConfig?.messageFieldLimit,
      customLimit: productConfig?.customFieldLimit,
      allergyLimit: productConfig?.allergyFieldLimit,
      calendarOpen: false,
      weight: item?.weight?.sort((a: any, b: any) => {
        return a?.value - b?.value;
      })?.[0]?.label,

      subTotal: item?.weight?.sort((a: any, b: any) => {
        return a?.value - b?.value;
      })?.[0]?.value,
      additionalValueFlavour:
        item?.availableFlavours?.length > 0
          ? item?.availableFlavours?.sort((a: any, b: any) => {
              return a?.value - b?.value;
            })?.[0]?.value
          : 0,
      additionalValueGourmet: 0,
      selectedFlavour:
        item?.availableFlavours?.length > 0
          ? item?.availableFlavours?.sort((a: any, b: any) => {
              return a?.value - b?.value;
            })?.[0]?.flavour
          : "",
      message: "",
      customization: "",
      gourmetOption: "",
      allergy: "",
      deliveryDate: minDate,
      deliveryTime: null,
    };
    setSelectedItem((prev: any) => {
      return { ...prev, ...itemObj };
    });
  };
  const AddItem = () => {
    setSearchTxt("");
    let arr = order;
    // @ts-ignore
    arr.push(selectedItem);
    setSelectedItem({});
    setOrder(arr);
    let total = 0;
    arr?.map((i: any) => {
      total =
        total +
        (i?.subTotal +
          i?.additionalValueFlavour +
          i?.additionalValueGourmet +
          ((i?.subTotal +
            i?.additionalValueFlavour +
            i?.additionalValueGourmet) *
            productConfig?.deliveryCharge) /
            100);
    });
    setGrandTotal(total);
  };

  const RemoveItem = (ind: number) => {
    let arr = order;
    setOrder(
      arr.filter((i: any, idx: number) => {
        return ind !== idx;
      })
    );
    let total = 0;
    arr?.map((i: any) => {
      total =
        total +
        (i?.subTotal +
          i?.additionalValueFlavour +
          i?.additionalValueGourmet +
          ((i?.subTotal +
            i?.additionalValueFlavour +
            i?.additionalValueGourmet) *
            productConfig?.deliveryCharge) /
            100);
    });
    setGrandTotal(total);
  };

  const AddOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let cart: {
      productId: any;
      productName: any;
      weight: any;
      flavour: any;
      gourmet: any;
      message: any;
      custom: any;
      allergy: any;
      delDate: any;
      delTime: any;
      subTotal: any;
    }[] = [];
    order?.map((i: any) => {
      cart.push({
        productId: i?.id,
        productName: i?.productName,
        weight: i?.weight,
        flavour: i?.selectedFlavour,
        gourmet: i?.gourmetOption,
        message: i?.message,
        custom: i?.customization,
        allergy: i?.allergy,
        delDate: i?.deliveryDate?.toDateString(),
        delTime: i?.deliveryTime,
        subTotal:
          i?.additionalValueGourmet +
          i?.additionalValueFlavour +
          i?.subTotal +
          ((i?.subTotal +
            i?.additionalValueFlavour +
            i?.additionalValueGourmet) *
            productConfig?.deliveryCharge) /
            100,
      });
    });
    let oid = `ORDER_${Math.floor(Math.random() * Date.now())}`;
    let cartItem =
      cart?.length === 1
        ? cart
        : cart?.map((i: any) => {
            return {
              ...i,
              subOrderId: `${oid}_${Math.floor(Math.random() * Date.now())}`,
              subOrderStatus: "Pending",
            };
          });
    let body = {
      type: "Offline",
      userId: "NA",
      oid: oid,
      txnId: "NA",
      items: cartItem,
      shippingAddress: address,
      total: grandTotal,
      paymentStatus: "Pending",
      orderStatus: "Pending",
      orderTimeStamp: moment().format().split("T").join(" "),
    };
    if (
      !body?.shippingAddress?.receiverName ||
      !body?.shippingAddress?.receiverContact ||
      !body?.shippingAddress?.street ||
      !body?.shippingAddress?.pin
    ) {
      toast.error("Fill up address correctly!");
      return;
    }
    let flag = 0;
    body.items?.map((i: any) => {
      if (i?.delTime === null) {
        flag = 1;
      }
    });
    if (flag === 1) {
      toast.error("Fill up items delivery time correctly!");
      return;
    }
    callApi(processIDs?.create_order, body) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(res?.data?.msg);
            setOrder([]);
            setAddress((prev: any) => {
              return {
                ...prev,
                receiverName: "",
                receiverContact: "",
                house: "",
                street: "",
                pin: "",
              };
            });
            setGrandTotal(0);
          } else {
            toast.error(res?.data?.msg);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err) => {
        toast.error(`Error: ${err}`);
      });
  };

  useEffect(() => {
    let total = 0;
    order?.map((i: any) => {
      total =
        total +
        (i?.subTotal +
          i?.additionalValueFlavour +
          i?.additionalValueGourmet +
          ((i?.subTotal +
            i?.additionalValueFlavour +
            i?.additionalValueGourmet) *
            productConfig?.deliveryCharge) /
            100);
    });
    setGrandTotal(total);
  }, [order]);

  return (
    <form onSubmit={AddOrder} className="manage-offline-orders">
      <div className="section search">
        <div className="search-container">
          <input
            type={"text"}
            value={searchTxt}
            onChange={FindProduct}
            placeholder={"Search by ID or name"}
            className="search-product"
          />
          {filterProduct?.length > 0 && (
            <div className="filter-product">
              {filterProduct?.map((i: any) => (
                <div
                  className="filter-item"
                  onClick={() => {
                    SelectProduct(i);
                  }}
                >
                  {i?.title}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={AddItem}
          disabled={JSON.stringify(selectedItem) === "{}"}
        >
          Add item
        </button>
      </div>
      <div className="section">
        <div className="header">
          <div className="title">Items:</div>
          <div className="grand-total">
            Total: {labelConfig?.inr_code}
            {grandTotal}
          </div>
        </div>
        <div className="details">
          {order?.length === 0 && <div>No items</div>}
          {order?.length > 0 && (
            <div>
              {order?.map((i: any, idx: number) => (
                <div className="order-items">
                  <div className="order-items-section">
                    <div className="label">Weight: </div>
                    <div className="value">{i?.weight} lbs</div>
                    <Select
                      isSearchable={false}
                      placeholder={"Select weight"}
                      onChange={(e: any) => {
                        setOrder(
                          // @ts-ignore
                          order?.map((v: any, ind: number) => {
                            if (ind === idx) {
                              return {
                                ...v,
                                weight: e?.label,
                                subTotal: e?.value,
                              };
                            }
                            return v;
                          })
                        );
                      }}
                      options={i?.availableWeights}
                    />
                  </div>
                  <div className="order-items-section">
                    <div className="label">Flavour: </div>
                    <div className="value">{i?.selectedFlavour}</div>
                    <Select
                      isSearchable={false}
                      placeholder={"Select flavour"}
                      onChange={(e: any) => {
                        setOrder(
                          // @ts-ignore
                          order?.map((v: any, ind: number) => {
                            if (ind === idx) {
                              return {
                                ...v,
                                selectedFlavour: e?.label,
                                additionalValueFlavour: e?.value,
                              };
                            }
                            return v;
                          })
                        );
                      }}
                      options={i?.availableFlavours?.map((i: any) => {
                        return { label: i?.flavour, value: i?.value };
                      })}
                    />
                  </div>
                  <div className="order-items-section">
                    <div className="label">Gourmet option: </div>
                    <div className="value">{i?.gourmetOption}</div>
                    <Select
                      isSearchable={false}
                      placeholder={"Select gourmet"}
                      onChange={(e: any) => {
                        setOrder(
                          // @ts-ignore
                          order?.map((v: any, ind: number) => {
                            if (ind === idx) {
                              return {
                                ...v,
                                gourmetOption: e?.label,
                                additionalValueGourmet: e?.value,
                              };
                            }
                            return v;
                          })
                        );
                      }}
                      options={i?.availableFlavours?.map((i: any) => {
                        return { label: i?.option, value: i?.value };
                      })}
                    />
                  </div>
                  <div className="order-items-section">
                    <div className="label">Message on cake: </div>
                    <div className="textarea">
                      <textarea
                        className="value"
                        value={i?.message}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          if (
                            i?.messageLimit > 0 ||
                            // @ts-ignore
                            e.nativeEvent.inputType === "deleteContentBackward"
                          ) {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    message: e?.target?.value,
                                    messageLimit:
                                      productConfig?.messageFieldLimit -
                                      e?.target?.value?.length,
                                  };
                                }
                                return v;
                              })
                            );
                          }
                        }}
                      />
                      <div className="count">
                        {i?.messageLimit}/{productConfig?.messageFieldLimit}
                      </div>
                    </div>
                  </div>
                  <div className="order-items-section">
                    <div className="label">Customization: </div>
                    <div className="textarea">
                      <textarea
                        className="value"
                        value={i?.customization}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          if (
                            i?.customLimit > 0 ||
                            // @ts-ignore
                            e.nativeEvent.inputType === "deleteContentBackward"
                          ) {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    customization: e?.target?.value,
                                    customLimit:
                                      productConfig?.customFieldLimit -
                                      e?.target?.value?.length,
                                  };
                                }
                                return v;
                              })
                            );
                          }
                        }}
                      />
                      <div className="count">
                        {i?.customLimit}/{productConfig?.customFieldLimit}
                      </div>
                    </div>
                  </div>
                  <div className="order-items-section">
                    <div className="label">Allergy: </div>
                    <div className="textarea">
                      <textarea
                        className="value"
                        value={i?.allergy}
                        onChange={(
                          e: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
                          if (
                            i?.allergyLimit > 0 ||
                            // @ts-ignore
                            e.nativeEvent.inputType === "deleteContentBackward"
                          ) {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    allergy: e?.target?.value,
                                    allergyLimit:
                                      productConfig?.allergyFieldLimit -
                                      e?.target?.value?.length,
                                  };
                                }
                                return v;
                              })
                            );
                          }
                        }}
                      />
                      <div className="count">
                        {i?.allergyLimit}/{productConfig?.allergyFieldLimit}
                      </div>
                    </div>
                  </div>
                  <div className="order-items-section">
                    <div className="label">Delivery date: </div>
                    {i?.calendarOpen ? (
                      <>
                        <Calendar
                          onChange={(e: any) => {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    calendarOpen: false,
                                    deliveryDate: e,
                                  };
                                }
                                return v;
                              })
                            );
                          }}
                          minDate={minDate}
                          maxDate={maxDate}
                          value={i?.deliveryDate}
                        />
                        <i
                          className="fa-solid fa-xmark cross"
                          onClick={() => {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    calendarOpen: false,
                                  };
                                }
                                return v;
                              })
                            );
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div className="value">
                          {i?.deliveryDate.toDateString()}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOrder(
                              // @ts-ignore
                              order?.map((v: any, ind: number) => {
                                if (ind === idx) {
                                  return {
                                    ...v,
                                    calendarOpen: true,
                                  };
                                }
                                return v;
                              })
                            );
                          }}
                        >
                          Select date
                        </button>
                      </>
                    )}
                  </div>
                  <div className="order-items-section">
                    <div className="label">Delivery time: </div>
                    <div className="value">{i?.selectedFlavour}</div>
                    <Select
                      isSearchable={false}
                      placeholder={"Select delivery time"}
                      onChange={(e: any) => {
                        setOrder(
                          // @ts-ignore
                          order?.map((v: any, ind: number) => {
                            if (ind === idx) {
                              return { ...v, deliveryTime: e?.label };
                            }
                            return v;
                          })
                        );
                      }}
                      options={serverConfig?.del_time_arr}
                    />
                  </div>
                  <div className="order-items-section">
                    <div className="label">Total: </div>
                    <div className="value total">
                      {labelConfig?.inr_code}
                      {i?.subTotal +
                        i?.additionalValueFlavour +
                        i?.additionalValueGourmet +
                        ((i?.subTotal +
                          i?.additionalValueFlavour +
                          i?.additionalValueGourmet) *
                          productConfig?.deliveryCharge) /
                          100}
                    </div>
                  </div>
                  <div className="order-items-section">
                    <button
                      type="button"
                      onClick={() => {
                        RemoveItem(idx);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="address">
            <div className="address-section">
              <div className="label">Full name</div>
              <input
                type={"text"}
                placeholder={"Enter full name"}
                value={address?.receiverName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress((prev: any) => {
                    return { ...prev, receiverName: e.target.value };
                  });
                }}
              />
            </div>
            <div className="address-section">
              <div className="label">Phone number</div>
              <PhoneInput
                defaultCountry={"IN"}
                addInternationalOption={false}
                autoComplete={"off"}
                limitMaxLength={true}
                maxLength={11}
                countries={["IN"]}
                placeholder="Enter phone number"
                value={address?.receiverContact}
                onChange={(e: any) => {
                  setAddress((prev: any) => {
                    return { ...prev, receiverContact: e };
                  });
                }}
              />
            </div>
            <div className="address-section">
              <div className="label">House / Building</div>
              <input
                type={"text"}
                placeholder={"Enter house or building no."}
                value={address?.house}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress((prev: any) => {
                    return { ...prev, house: e.target.value };
                  });
                }}
              />
            </div>
            <div className="address-section">
              <div className="label">Street no.</div>
              <input
                type={"text"}
                placeholder={"Enter street no."}
                value={address?.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress((prev: any) => {
                    return { ...prev, street: e.target.value };
                  });
                }}
              />
            </div>
            <div className="address-section">
              <div className="label">Pin code</div>
              <input
                placeholder="Enter pin code"
                type={"number"}
                value={address?.pin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (
                    e.target.value.length <= 6 ||
                    // @ts-ignore
                    e.nativeEvent.inputType === "deleteContentBackward"
                  ) {
                    setAddress((prev: any) => {
                      return { ...prev, pin: e.target.value };
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <button disabled={order?.length === 0}>Create order</button>
    </form>
  );
};

export default ManageOfflineOrders;
