import React, { useState, useEffect } from "react";
import useSwr from "swr";
import { toast } from "react-toastify";
import Select from "react-select";
import { processIDs } from "../../../config/processID";
import { responseType } from "../../../typings";
import { callApi } from "../../Functions/util";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_navbar, {})
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

const ManageCustomNav = () => {
  const {
    data: allNavbar,
    isLoading,
    error,
  } = useSwr("manage-navbar", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const [navbar, setNavbar] = useState<any[]>(allNavbar);
  const [catagoryData, setCatagoryData] = useState({
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
  const AddNavbar = (id: string) => {
    if (!id) {
      return;
    }
    callApi(processIDs?.add_navbar, { catagoryId: id })
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            toast.success(res?.data?.msg);
            console.log(res?.data?.returnData);

            setNavbar(res?.data?.returnData);
          } else {
            toast.error(res?.data?.msg);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
      });
  };
  const DeleteNavbar = (id: string) => {
    callApi(processIDs?.delete_navbar, { navId: id })
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnData) {
            toast.success(res?.data?.msg);

            setNavbar(res?.data?.returnData);
          } else {
            toast.error(res?.data?.msg);
          }
        } else {
          toast.error(`Error: ${res?.status}`);
        }
      })
      .catch((err: any) => {
        toast.error(`Error: ${err}`);
      });
  };
  useEffect(() => {
    setNavbar(allNavbar);
  }, [allNavbar]);
  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <div className="manage-navbar">
      <Select
        isSearchable={true}
        defaultValue={null}
        placeholder={"Select catagory"}
        onChange={(e: any) => {
          let arr = navbar;
          let dupval = arr.find((i: any) => {
            return i?.catagory?._id === e?.value;
          });
          if (dupval) {
            toast.error("Already added");
          } else {
            AddNavbar(e?.value);
          }
        }}
        onFocus={fetchCatagory}
        options={catagoryData?.data}
        isLoading={catagoryData?.loading}
        isClearable={true}
        className="dropdown"
      />
      {navbar?.length === 0 && <>No navbar to show</>}
      {navbar?.map((i, idx) => (
        <div className="catagory">
          <div className="name">
            {idx + 1}. {i?.catagory?.catagory}
          </div>
          <button
            type="button"
            onClick={() => {
              DeleteNavbar(i?._id);
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ManageCustomNav;
