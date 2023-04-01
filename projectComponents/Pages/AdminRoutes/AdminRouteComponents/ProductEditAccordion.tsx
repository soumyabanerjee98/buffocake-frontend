import React, { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Select from "react-select";
import { processIDs } from "../../../../config/processID";
import { callApi, uploadImage, weightConverter } from "../../../Functions/util";
import { responseType } from "../../../../typings";
import { labelConfig, serverConfig } from "../../../../config/siteConfig";
import Image from "next/image";
import Broken from "../../../Assets/Images/no-image.png";
const RTEditor = dynamic(() => import("../../../UI/RTEditor"), { ssr: false });

export type ProductEditAccordionProps = {
  product: any;
};

const ProductEditAccordion = (props: ProductEditAccordionProps) => {
  const { product } = props;
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const [exp, setExp] = useState(false);
  const [formData, setFormData] = useState({
    metaHead: product?.metaHead,
    metaDesc: product?.metaDesc,
    title: product?.title,
    description: product?.description,
    availableFlavours: { flavour: "", value: 0 },
    gourmetOptions: { option: "", value: 0 },
    weight: { label: "", value: 0 },
    imageEditId: "",
    imageEditPath: "",
    sameDay: product?.sameDay ? true : false,
  });
  const [catagoryData, setCatagoryData] = useState({
    loading: false,
    data: [],
  });
  const [subcatagoryData, setSubcatagoryData] = useState({
    loading: false,
    data: [],
  });
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
  const addProductImage = (e: any) => {
    if (product?.productImage?.length <= 5) {
      const fileArr = Array.from(e.target.files);
      console.log(fileArr);
      uploadImage(fileArr)
        // @ts-ignore
        .then((resB: responseType) => {
          if (resB?.status === 200) {
            if (resB?.data?.returnCode) {
              callApi(processIDs?.add_product_image, {
                productId: product?._id,
                mediaPath: resB?.data?.returnData[0]?.path,
              }) //@ts-ignore
                .then((res: responseType) => {
                  if (res?.status === 200) {
                    if (res?.data?.returnCode) {
                      toast.success(`${res?.data?.msg}`);
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
              toast.error(`${resB?.data?.msg}`);
            }
          } else {
            toast.error(`Error: ${resB?.status}`);
          }
        })
        .catch((err: any) => {
          toast.error(`Error: ${err}`);
        });
    } else {
      toast.error("Can not add more than 5 photos!");
    }
  };
  const updateProductImage = (e: any) => {
    const fileArr = Array.from(e.target.files);
    callApi(processIDs?.delete_photo, {
      mediaPath: formData?.imageEditPath,
    })
      // @ts-ignore
      .then((resA: responseType) => {
        if (resA?.status === 200) {
          if (resA?.data?.returnCode) {
            uploadImage(fileArr)
              // @ts-ignore
              .then((resB: responseType) => {
                if (resB?.status === 200) {
                  if (resB?.data?.returnCode) {
                    callApi(processIDs?.edit_product_image, {
                      productId: product?._id,
                      imageId: formData?.imageEditId,
                      mediaPath: resB?.data?.returnData[0]?.path,
                    }) //@ts-ignore
                      .then((res: responseType) => {
                        if (res?.status === 200) {
                          if (res?.data?.returnCode) {
                            toast.success(`${res?.data?.msg}`);
                            setFormData((prev: any) => {
                              return {
                                ...prev,
                                imageEditId: "",
                                imageEditPath: "",
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
                    toast.error(`${resB?.data?.msg}`);
                  }
                } else {
                  toast.error(`Error: ${resB?.status}`);
                }
              })
              .catch((err: any) => {
                toast.error(`Error: ${err}`);
              });
          } else {
            toast.error(`${resA?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${resA?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
      });
  };
  const deleteProductImage = (id: string, mediaPath: string) => {
    callApi(processIDs?.delete_photo, {
      mediaPath: mediaPath,
    })
      // @ts-ignore
      .then((resA: responseType) => {
        if (resA?.status === 200) {
          if (resA?.data?.returnCode) {
            callApi(processIDs?.delete_product_image, {
              productId: product?._id,
              imageId: id,
            }) //@ts-ignore
              .then((res: responseType) => {
                if (res?.status === 200) {
                  if (res?.data?.returnCode) {
                    toast.success(`${res?.data?.msg}`);
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
            toast.error(`${resA?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${resA?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
      });
  };
  const UpdateProduct = () => {
    callApi(processIDs?.update_product, {
      productId: product?._id,
      metaHead: formData?.metaHead,
      metaDesc: formData?.metaDesc,
      title: formData?.title,
      description: formData?.description,
      sameDay: formData?.sameDay,
    }) //@ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(`${res?.data?.msg}`);
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
  };
  const DeleteProduct = () => {
    if (product?.productImage?.length > 0) {
      callApi(processIDs?.delete_photo, { mediaPath: product?.productImage })
        //   @ts-ignore
        .then((res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              callApi(processIDs?.delete_product, { productId: product?._id })
                //   @ts-ignore
                .then((res: responseType) => {
                  if (res?.status === 200) {
                    if (res?.data?.returnCode) {
                      toast.success(`${res?.data?.msg}`);
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
      callApi(processIDs?.delete_product, { productId: product?._id })
        //   @ts-ignore
        .then((res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
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
  };
  return (
    <div className="product-manage-accordion">
      <div
        className="non-exp"
        onClick={() => {
          setExp((prev) => !prev);
        }}
      >
        <div className="name">{product?.title}</div>
        <div className="id">#{product?._id}</div>
      </div>
      {exp && (
        <div className="exp">
          <div className="details">
            <div className="details-section">
              <div className="title">Meta data title</div>
              <div className="edit">
                <input
                  className="value"
                  type="text"
                  value={formData?.metaHead}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev: any) => {
                      return { ...prev, metaHead: e.target.value };
                    });
                  }}
                />
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <div className="details-section">
              <div className="title">Meta data description</div>
              <div className="edit">
                <input
                  className="value"
                  type="text"
                  value={formData?.metaDesc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev: any) => {
                      return { ...prev, metaDesc: e.target.value };
                    });
                  }}
                />
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <div className="details-section">
              <div className="title">Product name</div>
              <div className="edit">
                <input
                  className="value"
                  type="text"
                  value={formData?.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev: any) => {
                      return { ...prev, title: e.target.value };
                    });
                  }}
                />
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <div className="details-section">
              <div className="title">Product description</div>
              <div className="edit">
                <RTEditor
                  editorClassName="value textarea"
                  wrapperClassName="editor-wrapper-edit"
                  text={formData?.description}
                  setText={setFormData}
                />
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <div className="details-section">
              <div className="title">Catagory</div>
              <div className="edit">
                {product?.catagory?.map((i: any) => {
                  return (
                    <div className="options">
                      <div className="option-name">{i?.catagoryName}</div>
                      <Select
                        isSearchable={true}
                        placeholder={"Edit catagory"}
                        onChange={(e: any) => {
                          let dupVal = product?.catagory?.find((i: any) => {
                            return i?.catagoryId === e.value;
                          });
                          if (dupVal) {
                            toast.error("Already added!");
                          } else {
                            callApi(processIDs?.edit_product_catagory, {
                              productId: product?._id,
                              catagoryId: i?._id,
                              label: e?.label,
                              value: e?.value,
                            }) //@ts-ignore
                              .then((res: responseType) => {
                                if (res?.status === 200) {
                                  if (res?.data?.returnCode) {
                                    toast.success("Catagory edited");
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
                        }}
                        onFocus={fetchCatagory}
                        options={catagoryData?.data}
                        isLoading={catagoryData?.loading}
                      />
                      <button
                        onClick={() => {
                          if (product?.catagory?.length === 1) {
                            toast.error("Can not delete last catagory");
                          } else {
                            callApi(processIDs?.delete_product_catagory, {
                              productId: product?._id,
                              catagoryId: i?._id,
                            }) //@ts-ignore
                              .then((res: responseType) => {
                                if (res?.status === 200) {
                                  if (res?.data?.returnCode) {
                                    toast.success(`${res?.data?.msg}`);
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="edit">
              <Select
                isSearchable={true}
                placeholder={"Add catagory"}
                onChange={(e: any) => {
                  let dupVal = product?.catagory?.find((i: any) => {
                    return i?.catagoryId === e.value;
                  });
                  if (dupVal) {
                    toast.error("Already added!");
                  } else {
                    callApi(processIDs?.add_product_catagory, {
                      productId: product?._id,
                      label: e?.label,
                      value: e?.value,
                    }) //@ts-ignore
                      .then((res: responseType) => {
                        if (res?.status === 200) {
                          if (res?.data?.returnCode) {
                            toast.success("Catagory added");
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
                }}
                onFocus={fetchCatagory}
                options={catagoryData?.data}
                isLoading={catagoryData?.loading}
              />
            </div>
            <div className="details-section">
              <div className="title">Sub catagory</div>
              <div className="edit">
                {product?.subCatagory?.map((i: any) => {
                  return (
                    <div className="options">
                      <div className="option-name">{i?.subCatagoryName}</div>
                      <Select
                        isSearchable={true}
                        placeholder={"Edit sub catagory"}
                        onChange={(e: any) => {
                          let dupVal = product?.subCatagory?.find((i: any) => {
                            return i?.subCatagoryId === e.value;
                          });
                          if (dupVal) {
                            toast.error("Already added!");
                          } else {
                            callApi(processIDs?.edit_product_subcatagory, {
                              productId: product?._id,
                              subCatagoryId: i?._id,
                              label: e?.label,
                              value: e?.value,
                            }) //@ts-ignore
                              .then((res: responseType) => {
                                if (res?.status === 200) {
                                  if (res?.data?.returnCode) {
                                    toast.success(`${res?.data?.msg}`);
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
                        }}
                        onFocus={fetchSubCatagory}
                        options={subcatagoryData?.data}
                        isLoading={subcatagoryData?.loading}
                      />
                      <button
                        onClick={() => {
                          if (product?.subCatagory?.length === 1) {
                            toast.error("Can not delete last sub catagory");
                          } else {
                            callApi(processIDs?.delete_product_subcatagory, {
                              productId: product?._id,
                              subCatagoryId: i?._id,
                            }) //@ts-ignore
                              .then((res: responseType) => {
                                if (res?.status === 200) {
                                  if (res?.data?.returnCode) {
                                    toast.success(`${res?.data?.msg}`);
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="edit">
              <Select
                isSearchable={true}
                placeholder={"Add sub catagory"}
                onChange={(e: any) => {
                  let dupVal = product?.subCatagory?.find((i: any) => {
                    return i?.subCatagoryId === e.value;
                  });
                  if (dupVal) {
                    toast.error("Already added!");
                  } else {
                    callApi(processIDs?.add_product_subcatagory, {
                      productId: product?._id,
                      label: e?.label,
                      value: e?.value,
                    }) //@ts-ignore
                      .then((res: responseType) => {
                        if (res?.status === 200) {
                          if (res?.data?.returnCode) {
                            toast.success(`${res?.data?.msg}`);
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
                }}
                onFocus={fetchSubCatagory}
                options={subcatagoryData?.data}
                isLoading={subcatagoryData?.loading}
              />
            </div>
            <div className="details-section">
              <div className="title">Available weight</div>
              <div className="edit">
                {product?.weight?.map((i: any) => {
                  return (
                    <div className="option">
                      Weight: {weightConverter(i?.label)}
                      <div>
                        Value: {labelConfig?.inr_code}
                        {i?.value}
                      </div>
                      <button
                        onClick={() => {
                          callApi(processIDs?.delete_product_weight, {
                            productId: product?._id,
                            weightId: i?._id,
                          }) //@ts-ignore
                            .then((res: responseType) => {
                              if (res?.status === 200) {
                                if (res?.data?.returnCode) {
                                  toast.success(`${res?.data?.msg}`);
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="edit">
              <input
                type={"number"}
                value={formData?.weight?.label}
                placeholder="Add weight"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  // @ts-ignore
                  if (e.nativeEvent.inputType) {
                    setFormData((prev: any) => {
                      return {
                        ...prev,
                        weight: {
                          ...prev.weight,
                          label: parseFloat(e.target.value),
                        },
                      };
                    });
                  }
                }}
              />
              {labelConfig?.product_weight_unit}
              <span>
                {labelConfig?.inr_code}
                <input
                  type={"number"}
                  value={formData?.weight?.value}
                  placeholder="Add value"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // @ts-ignore
                    if (e.nativeEvent.inputType) {
                      setFormData((prev: any) => {
                        return {
                          ...prev,
                          weight: {
                            ...prev.weight,
                            value: parseInt(e.target.value),
                          },
                        };
                      });
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                />
              </span>
              <button
                onClick={() => {
                  callApi(processIDs?.add_product_weight, {
                    productId: product?._id,
                    label: formData?.weight?.label,
                    value: formData?.weight?.value,
                  }) //@ts-ignore
                    .then((res: responseType) => {
                      if (res?.status === 200) {
                        if (res?.data?.returnCode) {
                          toast.success(`${res?.data?.msg}`);
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              weight: {
                                ...prev.weight,
                                label: "",
                                value: 0,
                              },
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
                }}
              >
                Add
              </button>
            </div>
            <div className="details-section">
              <div className="title">Available flavours</div>
              <div className="edit">
                {product?.availableFlavours?.map((i: any) => {
                  return (
                    <div className="option">
                      Flavour: {i?.flavour}
                      <div>
                        Value: {labelConfig?.inr_code}
                        {i?.value}
                      </div>
                      <button
                        onClick={() => {
                          callApi(processIDs?.delete_product_flavour, {
                            productId: product?._id,
                            flavourId: i?._id,
                          }) //@ts-ignore
                            .then((res: responseType) => {
                              if (res?.status === 200) {
                                if (res?.data?.returnCode) {
                                  toast.success(`${res?.data?.msg}`);
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="edit">
              <input
                type={"text"}
                value={formData?.availableFlavours?.flavour}
                placeholder="Add flavour"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev: any) => {
                    return {
                      ...prev,
                      availableFlavours: {
                        ...prev.availableFlavours,
                        flavour: e.target.value,
                      },
                    };
                  });
                }}
              />
              <span>
                {labelConfig?.inr_code}
                <input
                  type={"number"}
                  value={formData?.availableFlavours?.value}
                  placeholder="Add value"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // @ts-ignore
                    if (e.nativeEvent.inputType) {
                      setFormData((prev: any) => {
                        return {
                          ...prev,
                          availableFlavours: {
                            ...prev.availableFlavours,
                            value: parseInt(e.target.value),
                          },
                        };
                      });
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                />
              </span>
              <button
                onClick={() => {
                  callApi(processIDs?.add_product_flavour, {
                    productId: product?._id,
                    flavour: formData?.availableFlavours?.flavour,
                    value: formData?.availableFlavours?.value,
                  }) //@ts-ignore
                    .then((res: responseType) => {
                      if (res?.status === 200) {
                        if (res?.data?.returnCode) {
                          toast.success(`${res?.data?.msg}`);
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              availableFlavours: {
                                ...prev.availableFlavours,
                                flavour: "",
                                value: 0,
                              },
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
                }}
              >
                Add
              </button>
            </div>
            <div className="details-section">
              <div className="title">Available Gourmets</div>
              <div className="edit">
                {product?.gourmetOptions?.map((i: any) => {
                  return (
                    <div className="option">
                      Option: {i?.option}
                      <div>
                        Value: {labelConfig?.inr_code}
                        {i?.value}
                      </div>
                      <button
                        onClick={() => {
                          callApi(processIDs?.delete_product_custom, {
                            productId: product?._id,
                            customId: i?._id,
                          }) //@ts-ignore
                            .then((res: responseType) => {
                              if (res?.status === 200) {
                                if (res?.data?.returnCode) {
                                  toast.success(`${res?.data?.msg}`);
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
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="edit">
              <input
                type={"text"}
                value={formData?.gourmetOptions?.option}
                placeholder="Add option"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev: any) => {
                    return {
                      ...prev,
                      gourmetOptions: {
                        ...prev.gourmetOptions,
                        option: e.target.value,
                      },
                    };
                  });
                }}
              />
              <span>
                {labelConfig?.inr_code}
                <input
                  type={"number"}
                  value={formData?.gourmetOptions?.value}
                  placeholder="Add value"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // @ts-ignore
                    if (e.nativeEvent.inputType) {
                      setFormData((prev: any) => {
                        return {
                          ...prev,
                          gourmetOptions: {
                            ...prev.gourmetOptions,
                            value: parseInt(e.target.value),
                          },
                        };
                      });
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === ".") {
                      e.preventDefault();
                    }
                  }}
                />
              </span>
              <button
                onClick={() => {
                  callApi(processIDs?.add_product_custom, {
                    productId: product?._id,
                    option: formData?.gourmetOptions?.option,
                    value: formData?.gourmetOptions?.value,
                  }) //@ts-ignore
                    .then((res: responseType) => {
                      if (res?.status === 200) {
                        if (res?.data?.returnCode) {
                          toast.success(`${res?.data?.msg}`);
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              gourmetOptions: {
                                ...prev.gourmetOptions,
                                option: "",
                                value: 0,
                              },
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
                }}
              >
                Add
              </button>
            </div>
            <div className="details-section">
              <div className="title">Same day</div>
              <div className="edit">
                <input
                  className="value"
                  type="checkbox"
                  checked={formData?.sameDay}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev: any) => {
                      return { ...prev, sameDay: !prev.sameDay };
                    });
                  }}
                />
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <button onClick={DeleteProduct}>Delete Product</button>
          </div>
          <div className="image-section">
            {product?.productImage?.length === 0 && <div>No image found</div>}
            {product?.productImage?.map((i: any) => {
              return (
                <div>
                  <img src={`${url}${i?.mediaPath}`} alt="image" height={100} />
                  <button
                    onClick={() => {
                      setFormData((prev: any) => {
                        return {
                          ...prev,
                          imageEditId: i?._id,
                          imageEditPath: i?.mediaPath,
                        };
                      });
                      document
                        .getElementById(`image-input-update-${product?._id}`)
                        ?.click();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteProductImage(i?._id, i?.mediaPath);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
            <button
              className="add-image-button"
              onClick={() => {
                document
                  .getElementById(`image-input-add-${product?._id}`)
                  ?.click();
              }}
            >
              Add New image
            </button>
            <input
              id={`image-input-add-${product?._id}`}
              style={{ display: "none", appearance: "none" }}
              type={"file"}
              accept={"image/*"}
              multiple={false}
              onChange={addProductImage}
            />
            <input
              id={`image-input-update-${product?._id}`}
              style={{ display: "none", appearance: "none" }}
              type={"file"}
              accept={"image/*"}
              multiple={false}
              onChange={updateProductImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditAccordion;
