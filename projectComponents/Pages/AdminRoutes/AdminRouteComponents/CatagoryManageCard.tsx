import React, { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { processIDs } from "../../../../config/processID";
import { responseType } from "../../../../typings";
import { callApi } from "../../../Functions/util";

const CatagoryManageCard = () => {
  const [catagory, setCatagory] = useState("");
  const [subcatagory, setSubcatagory] = useState("");
  const [catagories, setCatagories] = useState({
    cat: [],
    cat_loading: false,
    subCat: [],
    subCat_loading: false,
  });
  const [selectedCatagory, setSelectedCatagory] = useState({
    label: "",
    value: "",
    priority: null,
  });
  const [selectedSubCatagory, setSelectedSubCatagory] = useState({
    label: "",
    value: "",
    priority: null,
  });
  const [catagorySubCatagoryMap, setCatagorySubCatagoryMap] = useState({
    mapLoading: false,
    catId: "",
    subCatArr: [],
  });
  const addCatagory = () => {
    if (catagory) {
      callApi(processIDs?.create_catagory, { label: catagory })
        // @ts-ignore
        .then((res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
              setCatagory("");
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
  const addSubCatagory = () => {
    if (subcatagory) {
      callApi(processIDs?.create_subcatagory, { label: subcatagory })
        // @ts-ignore
        .then((res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
              setSubcatagory("");
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
  const fetchCatagory = () => {
    setCatagories((prev: any) => {
      return { ...prev, cat_loading: true };
    });
    callApi(processIDs?.get_catagory, {})
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            let catArr = res?.data?.returnData?.map((i: any) => {
              return {
                label: i?.catagory,
                value: i?._id,
                priority: i?.priority,
              };
            });
            setCatagories((prev: any) => {
              return {
                ...prev,
                cat: catArr,
                cat_loading: false,
              };
            });
          } else {
            setCatagories((prev: any) => {
              return { ...prev, cat_loading: false };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setCatagories((prev: any) => {
            return { ...prev, cat_loading: false };
          });
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
        setCatagories((prev: any) => {
          return { ...prev, cat_loading: false };
        });
      });
  };
  const fetchCatagoryMap = (id: string) => {
    setCatagorySubCatagoryMap((prev: any) => {
      return { ...prev, mapLoading: true };
    });
    callApi(processIDs?.get_catagory_map, { catagoryId: id })
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            setCatagorySubCatagoryMap((prev: any) => {
              return {
                ...prev,
                catId: id,
                subCatArr: res?.data?.returnData,
                mapLoading: false,
              };
            });
          } else {
            setCatagorySubCatagoryMap((prev: any) => {
              return { ...prev, mapLoading: false };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setCatagorySubCatagoryMap((prev: any) => {
            return { ...prev, mapLoading: false };
          });
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
        setCatagorySubCatagoryMap((prev: any) => {
          return { ...prev, mapLoading: false };
        });
      });
  };
  const addCatagoryMap = (id: string) => {
    if (catagorySubCatagoryMap?.catId === "") {
      toast.error("Select a catagory first");
      return;
    }
    let dupval = catagorySubCatagoryMap?.subCatArr?.find((i: any) => {
      return i?.subCatagoryId === id;
    });
    if (dupval) {
      toast.error("Already added");
      return;
    }
    callApi(processIDs?.add_catagory_map, {
      catagoryId: catagorySubCatagoryMap?.catId,
      subCatagoryId: id,
    })
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            toast.success(`${res?.data?.msg}`);
            setCatagorySubCatagoryMap((prev: any) => {
              return {
                ...prev,
                subCatArr: res?.data?.returnData,
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
  };
  const removeCatagoryMap = (id: string) => {
    callApi(processIDs?.remove_catagory_map, {
      catagoryId: catagorySubCatagoryMap?.catId,
      subCatagoryMapId: id,
    })
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            toast.success(`${res?.data?.msg}`);
            setCatagorySubCatagoryMap((prev: any) => {
              return {
                ...prev,
                subCatArr: res?.data?.returnData,
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
  };
  const fetchSubCatagory = () => {
    setCatagories((prev: any) => {
      return { ...prev, subCat_loading: true };
    });
    callApi(processIDs?.get_subcatagory, {})
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            let subcatArr = res?.data?.returnData?.map((i: any) => {
              return {
                label: i?.subCatagory,
                value: i?._id,
                priority: i?.priority,
              };
            });
            setCatagories((prev: any) => {
              return {
                ...prev,
                subCat: subcatArr,
                subCat_loading: false,
              };
            });
          } else {
            setCatagories((prev: any) => {
              return { ...prev, subCat_loading: false };
            });
          }
        } else {
          toast.error(`Error: ${res?.status}`);
          setCatagories((prev: any) => {
            return { ...prev, subCat_loading: false };
          });
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
        setCatagories((prev: any) => {
          return { ...prev, subCat_loading: false };
        });
      });
  };
  const editCatagory = () => {
    callApi(processIDs?.update_catagory, {
      label: selectedCatagory?.label,
      value: selectedCatagory?.value,
      priority: selectedCatagory?.priority,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(`${res?.data?.msg}`);
            setSelectedCatagory((prev: any) => {
              return { ...prev, label: "", value: "" };
            });
          } else {
            toast.error(`${res?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  const editSubCatagory = () => {
    callApi(processIDs?.update_subcatagory, {
      label: selectedSubCatagory?.label,
      value: selectedSubCatagory?.value,
      priority: selectedSubCatagory?.priority,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(`${res?.data?.msg}`);
            setSelectedSubCatagory((prev: any) => {
              return { ...prev, label: "", value: "" };
            });
          } else {
            toast.error(`${res?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  const deleteCatagory = () => {
    callApi(processIDs?.delete_catagory, {
      value: selectedCatagory?.value,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(`${res?.data?.msg}`);
            setSelectedCatagory((prev: any) => {
              return { ...prev, label: "", value: "" };
            });
          } else {
            toast.error(`${res?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  const deleteSubCatagory = () => {
    callApi(processIDs?.delete_subcatagory, {
      value: selectedSubCatagory?.value,
    }) // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            toast.success(`${res?.data?.msg}`);
            setSelectedSubCatagory((prev: any) => {
              return { ...prev, label: "", value: "" };
            });
          } else {
            toast.error(`${res?.data?.msg}`);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  return (
    <div className="form">
      <div className="title">Catagory</div>
      <hr />
      <div className="form-section">
        <input
          value={catagory}
          className="data-value"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCatagory(e.target.value);
          }}
        />
        <button className="edit-button" onClick={addCatagory}>
          Add catagory
        </button>
      </div>
      <div className="form-section">
        <div>Select a catagory to modify</div>
        <Select
          isSearchable={true}
          placeholder={"Select catagory"}
          onChange={(e: any) => {
            setSelectedCatagory((prev: any) => {
              return {
                ...prev,
                label: e?.label,
                value: e?.value,
                priority: e?.priority,
              };
            });
          }}
          onFocus={fetchCatagory}
          options={catagories?.cat}
          isClearable={true}
          isLoading={catagories?.cat_loading}
        />
      </div>
      {selectedCatagory?.value && (
        <div className="form-section">
          <input
            value={selectedCatagory?.label}
            className="data-value"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedCatagory((prev: any) => {
                return { ...prev, label: e.target.value };
              });
            }}
          />
          <input
            type={"number"}
            // @ts-ignore
            value={selectedCatagory?.priority}
            className="data-value"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (
                // @ts-ignore
                e.nativeEvent.data ||
                // @ts-ignore
                e.nativeEvent.inputType === "deleteContentBackward"
              )
                setSelectedCatagory((prev: any) => {
                  return { ...prev, priority: parseInt(e.target.value) };
                });
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === ".") {
                e.preventDefault();
              }
            }}
          />
          <div>
            <button className="edit-button" onClick={editCatagory}>
              Update
            </button>
            <button className="edit-button" onClick={deleteCatagory}>
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="title">Sub Catagory</div>
      <hr />
      <div className="form-section">
        <input
          value={subcatagory}
          className="data-value"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSubcatagory(e.target.value);
          }}
        />
        <button className="edit-button" onClick={addSubCatagory}>
          Add sub catagory
        </button>
      </div>
      <div className="form-section">
        <div>Select a sub catagory to modify</div>
        <Select
          isSearchable={true}
          placeholder={"Select sub catagory"}
          onChange={(e: any) => {
            setSelectedSubCatagory((prev: any) => {
              return {
                ...prev,
                label: e?.label,
                value: e?.value,
                priority: e?.priority,
              };
            });
          }}
          onFocus={fetchSubCatagory}
          options={catagories?.subCat}
          isClearable={true}
          isLoading={catagories?.subCat_loading}
        />
      </div>
      {selectedSubCatagory?.value && (
        <div className="form-section">
          <input
            value={selectedSubCatagory?.label}
            className="data-value"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedSubCatagory((prev: any) => {
                return { ...prev, label: e.target.value };
              });
            }}
          />
          <input
            type={"number"}
            // @ts-ignore
            value={selectedSubCatagory?.priority}
            className="data-value"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (
                // @ts-ignore
                e.nativeEvent.data ||
                // @ts-ignore
                e.nativeEvent.inputType === "deleteContentBackward"
              )
                setSelectedSubCatagory((prev: any) => {
                  return { ...prev, priority: parseInt(e.target.value) };
                });
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === ".") {
                e.preventDefault();
              }
            }}
          />
          <div>
            <button className="edit-button" onClick={editSubCatagory}>
              Update
            </button>
            <button className="edit-button" onClick={deleteSubCatagory}>
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="title">Catagory - Sub catagory map</div>
      <hr />
      <Select
        isSearchable={true}
        placeholder={"Select catagory"}
        onChange={(e: any) => {
          if (e) {
            fetchCatagoryMap(e?.value);
          } else {
            setCatagorySubCatagoryMap((prev: any) => {
              return { ...prev, catId: "", subCatArr: [] };
            });
          }
        }}
        onFocus={fetchCatagory}
        options={catagories?.cat}
        isClearable={true}
        isLoading={
          catagories?.cat_loading || catagorySubCatagoryMap?.mapLoading
        }
      />
      <div className="form-section">
        <div className="cat-map">
          {catagorySubCatagoryMap?.catId !== "" &&
            catagorySubCatagoryMap?.subCatArr?.length === 0 && (
              <div className="maps">No sub catagory mapped</div>
            )}
          {catagorySubCatagoryMap?.subCatArr?.map((i: any) => {
            return (
              <div className="maps">
                <div className="mapname">{i?.subCatagoryName}</div>
                <button
                  className="edit-button"
                  onClick={() => removeCatagoryMap(i?._id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <Select
          isSearchable={true}
          placeholder={"Map sub catagory"}
          onChange={(e: any) => {
            if (e) {
              addCatagoryMap(e?.value);
            }
          }}
          onFocus={fetchSubCatagory}
          options={catagories?.subCat}
          isClearable={true}
          isLoading={
            catagories?.subCat_loading || catagorySubCatagoryMap?.mapLoading
          }
        />
      </div>
    </div>
  );
};

export default CatagoryManageCard;
