import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useSwr from "swr";
import { processIDs } from "../../../config/processID";
import { responseType } from "../../../typings";
import { callApi } from "../../Functions/util";
import CatagoryManageCard from "./AdminRouteComponents/CatagoryManageCard";
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
  } = useSwr("manage-products", dataFetcher);
  const [allProducts, setAllProducts] = useState(allProd);
  const [eventState, setEventState] = useState<any>({
    state: false,
    selectedElement: {},
  });
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
            return <div>{i?.title}</div>;
          })}
        </div>
        <div className="new-edit-data">
          <div className="title">Manage catagories</div>
          <hr />
          <CatagoryManageCard />
          <div className="title">Manage products</div>
          <hr />
          {eventState?.state ? (
            <ProductManageCard
              state={eventState?.state}
              metaHead={eventState?.selectedElement?.metaHead}
              metaDesc={eventState?.selectedElement?.metaDesc}
              title={eventState?.selectedElement?.title}
              description={eventState?.selectedElement?.description}
              catagoryArr={eventState?.selectedElement?.catagoryArr}
              subCatagoryArr={eventState?.selectedElement?.subCatagoryArr}
              unitValue={eventState?.selectedElement?.unitValue}
              minWeight={eventState?.selectedElement?.minWeight}
              productImage={eventState?.selectedElement?.productImage}
              availableFlavours={eventState?.selectedElement?.availableFlavours}
              customOptions={eventState?.selectedElement?.customOptions}
            />
          ) : (
            <ProductManageCard
              state={eventState?.state}
              metaHead={""}
              metaDesc={""}
              title={""}
              description={""}
              catagoryArr={[]}
              subCatagoryArr={[]}
              unitValue={null}
              minWeight={1}
              productImage={null}
              availableFlavours={[]}
              customOptions={[]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
