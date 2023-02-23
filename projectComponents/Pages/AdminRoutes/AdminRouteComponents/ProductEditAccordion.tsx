import React, { useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { processIDs } from "../../../../config/processID";
import { callApi, uploadImage } from "../../../Functions/util";
import { responseType } from "../../../../typings";
import { labelConfig, serverConfig } from "../../../../config/siteConfig";
import Image from "next/image";
import Broken from "../../../Assets/Images/no-image.png";

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
    unitValue: product?.unitValue,
    minWeight: product?.minWeight,
    productImage: {
      editState: false,
      preview: null,
      dataArr: null,
    },
    availableFlavours: { flavour: "", value: 0 },
    customOptions: { option: "", value: 0 },
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
  const setImage = (e: any) => {
    const fileArr = Array.from(e.target.files);
    const imageSrc = URL.createObjectURL(e.target.files[0]);
    setFormData((prev: any) => {
      return {
        ...prev,
        productImage: {
          ...prev.productImage,
          editState: true,
          dataArr: fileArr,
          preview: imageSrc,
        },
      };
    });
  };
  const UpdateProduct = () => {
    if (formData?.productImage?.editState) {
      if (product?.productImage) {
        callApi(processIDs?.delete_photo, {
          mediaPath: product?.productImage,
        })
          // @ts-ignore
          .then((resA: responseType) => {
            if (resA?.status === 200) {
              if (resA?.data?.returnCode) {
                if (formData?.productImage?.dataArr) {
                  uploadImage(formData?.productImage?.dataArr)
                    // @ts-ignore
                    .then((resB: responseType) => {
                      if (resB?.status === 200) {
                        if (resB?.data?.returnCode) {
                          callApi(processIDs?.update_product, {
                            productId: product?._id,
                            metaHead: formData?.metaHead,
                            metaDesc: formData?.metaDesc,
                            title: formData?.title,
                            description: formData?.description,
                            unitValue: formData?.unitValue,
                            minWeight: formData?.minWeight,
                            productImage: resB?.data?.returnData[0]?.path,
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
                  callApi(processIDs?.update_product, {
                    productId: product?._id,
                    metaHead: formData?.metaHead,
                    metaDesc: formData?.metaDesc,
                    title: formData?.title,
                    description: formData?.description,
                    unitValue: formData?.unitValue,
                    minWeight: formData?.minWeight,
                    productImage: null,
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
      } else {
        if (formData?.productImage?.dataArr) {
          uploadImage(formData?.productImage?.dataArr)
            // @ts-ignore
            .then((resB: responseType) => {
              if (resB?.status === 200) {
                if (resB?.data?.returnCode) {
                  callApi(processIDs?.update_product, {
                    productId: product?._id,
                    metaHead: formData?.metaHead,
                    metaDesc: formData?.metaDesc,
                    title: formData?.title,
                    description: formData?.description,
                    unitValue: formData?.unitValue,
                    minWeight: formData?.minWeight,
                    productImage: resB?.data?.returnData[0]?.path,
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
          callApi(processIDs?.update_product, {
            productId: product?._id,
            metaHead: formData?.metaHead,
            metaDesc: formData?.metaDesc,
            title: formData?.title,
            description: formData?.description,
            unitValue: formData?.unitValue,
            minWeight: formData?.minWeight,
            productImage: null,
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
      }
    } else {
      callApi(processIDs?.update_product, {
        productId: product?._id,
        metaHead: formData?.metaHead,
        metaDesc: formData?.metaDesc,
        title: formData?.title,
        description: formData?.description,
        unitValue: formData?.unitValue,
        minWeight: formData?.minWeight,
        productImage: product?.productImage,
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
  };
  const DeleteProduct = () => {
    if (product?.productImage) {
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
                <textarea
                  className="value texarea"
                  value={formData?.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setFormData((prev: any) => {
                      return { ...prev, description: e.target.value };
                    });
                  }}
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
              <div className="title">Unit price</div>
              <div className="edit">
                <span>
                  {labelConfig?.inr_code}
                  <input
                    className="value"
                    type="number"
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
                <button onClick={UpdateProduct}>Save</button>
              </div>
            </div>
            <div className="details-section">
              <div className="title">Minimum weight</div>
              <div className="edit">
                <span>
                  <input
                    className="value"
                    type="number"
                    value={formData?.minWeight}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData((prev: any) => {
                        return { ...prev, minWeight: parseInt(e.target.value) };
                      });
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === ".") {
                        e.preventDefault();
                      }
                    }}
                  />
                  lbs
                </span>
                <button onClick={UpdateProduct}>Save</button>
              </div>
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
                    setFormData((prev: any) => {
                      return {
                        ...prev,
                        availableFlavours: {
                          ...prev.availableFlavours,
                          value: parseInt(e.target.value),
                        },
                      };
                    });
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
              <div className="title">Available Customizations</div>
              <div className="edit">
                {product?.customOptions?.map((i: any) => {
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
                value={formData?.customOptions?.option}
                placeholder="Add option"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData((prev: any) => {
                    return {
                      ...prev,
                      customOptions: {
                        ...prev.customOptions,
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
                  value={formData?.customOptions?.value}
                  placeholder="Add value"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData((prev: any) => {
                      return {
                        ...prev,
                        customOptions: {
                          ...prev.customOptions,
                          value: parseInt(e.target.value),
                        },
                      };
                    });
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
                    option: formData?.customOptions?.option,
                    value: formData?.customOptions?.value,
                  }) //@ts-ignore
                    .then((res: responseType) => {
                      if (res?.status === 200) {
                        if (res?.data?.returnCode) {
                          toast.success(`${res?.data?.msg}`);
                          setFormData((prev: any) => {
                            return {
                              ...prev,
                              customOptions: {
                                ...prev.customOptions,
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
            <button onClick={DeleteProduct}>Delete Product</button>
          </div>
          <div className="image-section">
            {formData?.productImage?.preview ? (
              <img
                src={formData?.productImage?.preview}
                alt="Product image"
                height={100}
              />
            ) : product?.productImage && !formData?.productImage?.editState ? (
              <img
                src={`${url}${product?.productImage}`}
                alt="Product image"
                height={100}
              />
            ) : (
              <Image src={Broken} alt="No image" height={100} />
            )}
            <button onClick={UpdateProduct}>Save</button>
            <button
              onClick={() => {
                document
                  .getElementById(`image-input-update-${product?._id}`)
                  ?.click();
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                setFormData((prev: any) => {
                  return {
                    ...prev,
                    productImage: {
                      ...prev.productImage,
                      editState: true,
                      dataArr: null,
                      preview: null,
                    },
                  };
                });
              }}
            >
              Delete
            </button>
            <input
              id={`image-input-update-${product?._id}`}
              style={{ display: "none", appearance: "none" }}
              type={"file"}
              accept={"image/*"}
              multiple={false}
              onChange={setImage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditAccordion;
