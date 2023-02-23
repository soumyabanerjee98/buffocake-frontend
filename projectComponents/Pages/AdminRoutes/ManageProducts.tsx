import Image from "next/image";
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
  const searchProd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTxt(e.target.value);
    setAllProducts(
      allProducts?.filter((i: any) => {
        return i?._id === e.target.value;
      })
    );
  };
  const ResetSearch = () => {
    setSearchTxt("");
    setAllProducts(allProd);
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
        <div className="filter"></div>
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
