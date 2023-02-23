import Image from "next/image";
import React, { useState } from "react";
import NOImage from "../../../Assets/Images/no-image.png";
import Select from "react-select";
import { labelConfig } from "../../../../config/siteConfig";
import { toast } from "react-toastify";
import { callApi, uploadImage } from "../../../Functions/util";
import { processIDs } from "../../../../config/processID";
import { responseType } from "../../../../typings";

const ProductManageCard = () => {
  const [formData, setFormData] = useState({
    metaHead: "",
    metaDesc: "",
    title: "",
    description: "",
    catagoryArr: [],
    subCatagoryArr: [],
    unitValue: 0,
    minWeight: 1,
    productImage: {
      preview: null,
      dataArr: null,
    },
    availableFlavours: [],
    customOptions: [],
  });
  const [flavourState, setFlavourState] = useState({
    flavour: "",
    value: 0,
  });
  const [customState, setCustomState] = useState({
    option: "",
    value: 0,
  });
  const [catagoryData, setCatagoryData] = useState({
    loading: false,
    data: [],
  });
  const [subcatagoryData, setSubcatagoryData] = useState({
    loading: false,
    data: [],
  });
  const setImage = (e: any) => {
    const fileArr = Array.from(e.target.files);
    const imageSrc = URL.createObjectURL(e.target.files[0]);
    setFormData((prev: any) => {
      return {
        ...prev,
        productImage: {
          ...prev.productImage,
          dataArr: fileArr,
          preview: imageSrc,
        },
      };
    });
  };
  const fetchCatagory = () => {
    setCatagoryData((prev: any) => {
      return { ...prev, loading: true };
    });
    callApi(processIDs?.get_catagory, {})
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            let catArr = res?.data?.returnData?.map((i: any) => {
              return { label: i?.catagory, value: i?._id };
            });
            setCatagoryData((prev: any) => {
              return {
                ...prev,
                data: catArr,
                loading: false,
              };
            });
          } else {
            setCatagoryData((prev: any) => {
              return { ...prev, loading: false };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setCatagoryData((prev: any) => {
            return { ...prev, loading: false };
          });
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
        setCatagoryData((prev: any) => {
          return { ...prev, loading: false };
        });
      });
  };
  const fetchSubCatagory = () => {
    setSubcatagoryData((prev: any) => {
      return { ...prev, subCat_loading: true };
    });
    callApi(processIDs?.get_subcatagory, {})
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            let subcatArr = res?.data?.returnData?.map((i: any) => {
              return { label: i?.subCatagory, value: i?._id };
            });
            setSubcatagoryData((prev: any) => {
              return {
                ...prev,
                data: subcatArr,
                loading: false,
              };
            });
          } else {
            setSubcatagoryData((prev: any) => {
              return { ...prev, loading: false };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setSubcatagoryData((prev: any) => {
            return { ...prev, loading: false };
          });
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
        setSubcatagoryData((prev: any) => {
          return { ...prev, loading: false };
        });
      });
  };
  const AddProduct = () => {
    if (
      !formData?.metaHead ||
      !formData?.metaDesc ||
      !formData?.title ||
      !formData?.description ||
      formData?.catagoryArr?.length === 0 ||
      formData?.subCatagoryArr?.length === 0 ||
      !formData?.unitValue ||
      formData?.unitValue === 0
    ) {
      toast.error("Please fill up required fields");
    } else {
      if (formData?.productImage?.preview) {
        uploadImage(formData?.productImage?.dataArr)
          // @ts-ignore
          .then((res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                callApi(processIDs?.save_new_product, {
                  metaHead: formData?.metaHead,
                  metaDesc: formData?.metaDesc,
                  title: formData?.title,
                  description: formData?.description,
                  catagoryArr: formData?.catagoryArr,
                  subCatagoryArr: formData?.subCatagoryArr,
                  unitValue: formData?.unitValue,
                  minWeight: formData?.minWeight
                    ? formData?.minWeight
                    : formData?.minWeight === 0
                    ? 1
                    : formData?.minWeight,
                  availableFlavours: formData?.availableFlavours,
                  customOptions: formData?.customOptions,
                  productImage: res?.data?.returnData[0]?.path,
                }) // @ts-ignore
                  .then((res: responseType) => {
                    if (res?.status === 200) {
                      if (res?.data?.returnCode) {
                        toast.success(`${res?.data?.msg}`);
                        setFormData((prev: any) => {
                          return {
                            ...prev,
                            metaHead: "",
                            metaDesc: "",
                            title: "",
                            description: "",
                            catagoryArr: [],
                            subCatagoryArr: [],
                            unitValue: 0,
                            minWeight: 1,
                            productImage: {
                              preview: null,
                              dataArr: null,
                            },
                            availableFlavours: [],
                            customOptions: [],
                          };
                        });
                      } else {
                        toast.error(`${res?.data?.msg}`);
                      }
                    } else {
                      toast.error(`Error: ${res?.status}`);
                    }
                  })
                  .catch((err: any) => {
                    toast.error(`Error: ${err}`);
                  });
              } else {
                toast.error(`${res?.data?.msg}`);
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err}`);
          });
      } else {
        callApi(processIDs?.save_new_product, {
          metaHead: formData?.metaHead,
          metaDesc: formData?.metaDesc,
          title: formData?.title,
          description: formData?.description,
          catagoryArr: formData?.catagoryArr,
          subCatagoryArr: formData?.subCatagoryArr,
          unitValue: formData?.unitValue,
          minWeight: formData?.minWeight
            ? formData?.minWeight
            : formData?.minWeight === 0
            ? 1
            : formData?.minWeight,
          availableFlavours: formData?.availableFlavours,
          customOptions: formData?.customOptions,
        }) //@ts-ignore
          .then((res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                toast.success(`${res?.data?.msg}`);
                setFormData((prev: any) => {
                  return {
                    ...prev,
                    metaHead: "",
                    metaDesc: "",
                    title: "",
                    description: "",
                    catagoryArr: [],
                    subCatagoryArr: [],
                    unitValue: 0,
                    minWeight: 1,
                    productImage: {
                      preview: null,
                      dataArr: null,
                    },
                    availableFlavours: [],
                    customOptions: [],
                  };
                });
              } else {
                toast.error(`${res?.data?.msg}`);
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          })
          .catch((err: any) => {
            toast.error(`Error: ${err}`);
          });
      }
    }
  };
  return (
    <div className="form">
      <div className="form-section">
        <label>
          Metadata title <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.metaHead}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, metaHead: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section">
        <label>
          Metadata description <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.metaDesc}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, metaDesc: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section">
        <label>
          Product name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, title: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section textarea">
        <label>
          Product description <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          className="data-value textarea"
          value={formData?.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData((prev: any) => {
              return { ...prev, description: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section selection">
        <label>
          Catagory <span style={{ color: "red" }}>*</span>
        </label>
        <div>
          {formData?.catagoryArr?.map((i: any, idx: number) => {
            return (
              <div className="options">
                <div className="option-items">
                  <div>{i?.label}</div>
                  {/* <Select
                    isSearchable={true}
                    placeholder={"Select catagory"}
                    onChange={(e: any) => {
                      let arrState = formData.catagoryArr;
                      let dupval = arrState.find((i: any) => {
                        return i?.value === e?.value;
                      });
                      if (dupval) {
                        toast.error("Already added");
                      } else {
                        let arr = formData?.catagoryArr?.map(
                          (i: any, ind: number) => {
                            if (idx === ind) {
                              return { ...i, label: e?.label, value: e?.value };
                            }
                            return i;
                          }
                        );
                        setFormData((prev: any) => {
                          return { ...prev, catagoryArr: arr };
                        });
                      }
                    }}
                    onFocus={fetchCatagory}
                    options={catagoryData?.data}
                    isLoading={catagoryData?.loading}
                  /> */}

                  <button
                    className="edit-button"
                    onClick={() => {
                      let arr = formData?.catagoryArr.filter((v: any) => {
                        return v?.value !== i?.value;
                      });
                      setFormData((prev: any) => {
                        return { ...prev, catagoryArr: arr };
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="options">
          <div>Add new catagory</div>
          <div className="option-items">
            <Select
              isSearchable={true}
              defaultValue={null}
              placeholder={"Select catagory"}
              onChange={(e: any) => {
                let arr = formData.catagoryArr;
                let dupval = arr.find((i: any) => {
                  return i?.value === e?.value;
                });
                if (dupval) {
                  toast.error("Already added");
                } else {
                  // @ts-ignore
                  arr.push(e);
                  setFormData((prev: any) => {
                    return { ...prev, catagoryArr: arr };
                  });
                }
              }}
              onFocus={fetchCatagory}
              options={catagoryData?.data}
              isLoading={catagoryData?.loading}
            />
          </div>
        </div>
      </div>
      <div className="form-section selection">
        <label>
          Sub catagory <span style={{ color: "red" }}>*</span>
        </label>
        <div>
          {formData?.subCatagoryArr?.map((i: any, idx: number) => {
            return (
              <div className="options">
                <div className="option-items">
                  <div>{i?.label}</div>
                  {/* <Select
                    isSearchable={true}
                    placeholder={"Select sub catagory"}
                    onChange={(e: any) => {
                      let arrState = formData.subCatagoryArr;
                      let dupval = arrState.find((i: any) => {
                        return i?.value === e?.value;
                      });
                      if (dupval) {
                        toast.error("Already added");
                      } else {
                        let arr = formData?.subCatagoryArr?.map(
                          (i: any, ind: number) => {
                            if (idx === ind) {
                              return { ...i, label: e?.label, value: e?.value };
                            }
                            return i;
                          }
                        );
                        setFormData((prev: any) => {
                          return { ...prev, subCatagoryArr: arr };
                        });
                      }
                    }}
                    onFocus={fetchSubCatagory}
                    options={subcatagoryData?.data}
                    isLoading={subcatagoryData?.loading}
                  /> */}

                  <button
                    className="edit-button"
                    onClick={() => {
                      let arr = formData?.subCatagoryArr.filter((v: any) => {
                        return v?.value !== i?.value;
                      });
                      setFormData((prev: any) => {
                        return { ...prev, subCatagoryArr: arr };
                      });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="options">
          <div>Add new sub catagory</div>
          <div className="option-items">
            <Select
              isSearchable={true}
              defaultValue={null}
              placeholder={"Select sub catagory"}
              onChange={(e: any) => {
                let arr = formData.subCatagoryArr;
                let dupval = arr.find((i: any) => {
                  return i?.value === e?.value;
                });
                if (dupval) {
                  toast.error("Already added");
                } else {
                  // @ts-ignore
                  arr.push(e);
                  setFormData((prev: any) => {
                    return { ...prev, subCatagoryArr: arr };
                  });
                }
              }}
              onFocus={fetchSubCatagory}
              options={subcatagoryData?.data}
              isLoading={subcatagoryData?.loading}
            />
          </div>
        </div>
      </div>
      <div className="form-section">
        <label>
          Unit price <span style={{ color: "red" }}>*</span>
        </label>
        <div>
          <span>
            {labelConfig?.inr_code}
            <input
              type={"number"}
              className="data-value"
              value={formData?.unitValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFormData((prev: any) => {
                  return { ...prev, unitValue: parseInt(e.target.value) };
                });
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === ".") {
                  e.preventDefault();
                }
              }}
            />
          </span>
        </div>
      </div>
      <div className="form-section">
        <label>Minimum weight</label>
        <span>
          <input
            type={"number"}
            className="data-value"
            value={formData?.minWeight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (parseInt(e.target.value) > -1) {
                setFormData((prev: any) => {
                  return { ...prev, minWeight: parseInt(e.target.value) };
                });
              }
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === ".") {
                e.preventDefault();
              }
            }}
          />
          lbs
        </span>
      </div>
      <div className="form-section">
        <label>Product image</label>
        <div className="data-value image">
          {formData?.productImage?.preview ? (
            <img
              src={formData?.productImage?.preview}
              alt="Product image"
              height={100}
            />
          ) : (
            <Image src={NOImage} alt="No image" height={100} />
          )}
          <button
            className="edit-button"
            onClick={() => {
              document.getElementById("image-input")?.click();
            }}
          >
            Add
          </button>
          <button
            className="edit-button"
            onClick={() => {
              setFormData((prev: any) => {
                return {
                  ...prev,
                  productImage: {
                    ...prev.productImage,
                    preview: null,
                    dataArr: null,
                  },
                };
              });
            }}
          >
            Reset
          </button>
        </div>
        <input
          id="image-input"
          style={{ display: "none", appearance: "none" }}
          type={"file"}
          accept={"image/*"}
          multiple={false}
          onChange={setImage}
        />
      </div>
      <div className="form-section selection">
        <label>Available flavors</label>
        <div className="options">
          {formData?.availableFlavours?.map((i: any, idx: number) => {
            return (
              <div className="data-value">
                <div className="option-items">
                  <div>Flavour:</div>
                  <div>{i?.flavour}</div>
                </div>
                <div className="option-items">
                  <div>Value:</div>
                  <span>
                    {labelConfig?.inr_code}
                    {i?.value}
                  </span>
                </div>
                <button
                  className="edit-button"
                  onClick={() => {
                    let arr = formData?.availableFlavours?.filter(
                      (i: any, ind: number) => {
                        return idx !== ind;
                      }
                    );
                    setFormData((prev: any) => {
                      return { ...prev, availableFlavours: arr };
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <div className="options">
          <div className="option-items">
            <label>Flavour</label>
            <input
              className="data-value"
              type={"text"}
              value={flavourState?.flavour}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFlavourState((prev: any) => {
                  return { ...prev, flavour: e.target.value };
                });
              }}
            />
          </div>
          <div className="option-items">
            <label>Value</label>
            <span>
              {labelConfig?.inr_code}
              <input
                className="data-value"
                type={"number"}
                value={flavourState?.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFlavourState((prev: any) => {
                    return { ...prev, value: parseInt(e.target.value) };
                  });
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
            </span>
          </div>
          <button
            className="edit-button"
            onClick={() => {
              let arr = formData?.availableFlavours;
              // @ts-ignore
              arr.push(flavourState);
              setFormData((prev: any) => {
                return { ...prev, availableFlavours: arr };
              });
              setFlavourState((prev: any) => {
                return { ...prev, flavour: "", value: 0 };
              });
            }}
          >
            Add
          </button>
        </div>
      </div>
      <div className="form-section selection">
        <label>Available Customizations</label>
        <div className="options">
          {formData?.customOptions?.map((i: any, idx: number) => {
            return (
              <div className="data-value">
                <div className="option-items">
                  <div>Option:</div>
                  <div>{i?.option}</div>
                </div>
                <div className="option-items">
                  <div>Value:</div>
                  <span>
                    {labelConfig?.inr_code}
                    {i?.value}
                  </span>
                </div>
                <button
                  className="edit-button"
                  onClick={() => {
                    let arr = formData?.customOptions?.filter(
                      (i: any, ind: number) => {
                        return idx !== ind;
                      }
                    );
                    setFormData((prev: any) => {
                      return { ...prev, customOptions: arr };
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <div className="options">
          <div className="option-items">
            <label>Option</label>
            <input
              className="data-value"
              type={"text"}
              value={customState?.option}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomState((prev: any) => {
                  return { ...prev, option: e.target.value };
                });
              }}
            />
          </div>
          <div className="option-items">
            <label>Value</label>
            <span>
              {labelConfig?.inr_code}
              <input
                className="data-value"
                type={"number"}
                value={customState?.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCustomState((prev: any) => {
                    return { ...prev, value: parseInt(e.target.value) };
                  });
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === ".") {
                    e.preventDefault();
                  }
                }}
              />
            </span>
          </div>
          <button
            className="edit-button"
            onClick={() => {
              let arr = formData?.customOptions;
              // @ts-ignore
              arr.push(customState);
              setFormData((prev: any) => {
                return { ...prev, availableFlavours: arr };
              });
              setCustomState((prev: any) => {
                return { ...prev, option: "", value: 0 };
              });
            }}
          >
            Add
          </button>
        </div>
      </div>
      <button className="edit-button" onClick={AddProduct}>
        Add product
      </button>
    </div>
  );
};

export default ProductManageCard;
