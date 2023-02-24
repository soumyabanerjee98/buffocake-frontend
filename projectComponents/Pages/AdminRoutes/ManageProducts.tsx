import Image from "next/image";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSwr from "swr";
import { processIDs } from "../../../config/processID";
import { responseType } from "../../../typings";
import { callApi } from "../../Functions/util";
import CatagoryManageCard from "./AdminRouteComponents/CatagoryManageCard";
import ProductEditAccordion from "./AdminRouteComponents/ProductEditAccordion";
import ProductManageCard from "./AdminRouteComponents/ProductManageCard";

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
const ManageProducts = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const {
    data: allProd,
    isLoading,
    error,
  } = useSwr("manage-products", dataFetcher, { refreshInterval: 1 });
  const [allProducts, setAllProducts] = useState(allProd);
  const [catagoryData, setCatagoryData] = useState({
    loading: false,
    data: [],
  });
  const [subcatagoryData, setSubcatagoryData] = useState({
    loading: false,
    data: [],
  });
  const searchProd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTxt(e.target.value);
    if (e.target.value === "") {
      setAllProducts(allProd);
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
      setAllProducts(arr);
    }
  };
  const ResetSearch = () => {
    setSearchTxt("");
    setAllProducts(allProd);
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
  useEffect(() => {
    setAllProducts(allProd);
  }, [allProd]);

  return (
    <div className="manage-products">
      <div className="search-filter-bar">
        <div className="search">
          <input
            type={"text"}
            className="product-search"
            value={searchTxt}
            onChange={searchProd}
            placeholder="Search by ID or name"
          />
          <button className="product-reset" onClick={ResetSearch}>
            Reset
          </button>
        </div>
        <div className="filter">
          <Select
            isSearchable={true}
            defaultValue={null}
            placeholder={"Filter catagory"}
            onChange={(e: any) => {
              if (e) {
                let arr: any = [];
                allProducts?.map((i: any) => {
                  let val = i?.catagory?.find((w: any) => {
                    return w?.catagoryId === e?.value;
                  });
                  if (val) {
                    arr.push(i);
                  }
                });
                setAllProducts(arr);
              }
            }}
            onFocus={fetchCatagory}
            options={catagoryData?.data}
            isLoading={catagoryData?.loading}
            isClearable={true}
          />
          <Select
            isSearchable={true}
            defaultValue={null}
            placeholder={"Filter sub catagory"}
            onChange={(e: any) => {
              if (e) {
                let arr: any = [];
                allProducts?.map((i: any) => {
                  let val = i?.subCatagory?.find((w: any) => {
                    return w?.subCatagoryId === e?.value;
                  });
                  if (val) {
                    arr.push(i);
                  }
                });
                setAllProducts(arr);
              }
            }}
            onFocus={fetchSubCatagory}
            options={subcatagoryData?.data}
            isLoading={subcatagoryData?.loading}
            isClearable={true}
          />
          <button
            className="edit-button"
            onClick={() => {
              setAllProducts(allProd);
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="data-section">
        <div className="all-data">
          {isLoading && <>Loading...</>}
          {allProducts?.length === 0 && <>No products found</>}
          {allProducts?.map((i: any) => {
            return <ProductEditAccordion product={i} />;
          })}
        </div>
        <div className="new-edit-data">
          <div className="title">Manage catagories</div>
          <hr />
          <CatagoryManageCard />
          <div className="title">Manage products</div>
          <hr />
          <ProductManageCard />
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
