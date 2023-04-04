import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { callApi } from "../Functions/util";
import { messageService } from "../Functions/messageService";
import { useRouter } from "next/router";
import { labelConfig } from "../../config/siteConfig";
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
export type NavbarProps = {
  products: any;
  catagories: any;
};
const Navbar = (props: NavbarProps) => {
  const {
    data: allNavbar,
    isLoading,
    error,
  } = useSwr("header-navbar", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const { products, catagories } = props;
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<any>(products);
  const [allCatagory, setAllCatagory] = useState({
    catArr: catagories?.cat,
    subCatArr: catagories?.subCat,
  });
  const [navbar, setNavbar] = useState<any[]>(allNavbar);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [catagorySearchResult, setCatagorySearchResult] = useState({
    cat: [],
    subCat: [],
  });
  const closePopUp = () => {
    // @ts-ignore
    messageService?.sendMessage("navbar", { action: "close-popup" }, "header");
  };
  const clickOutSide = (e: React.MouseEvent<HTMLDivElement>) => {
    // @ts-ignore
    if (e.target.className === "navbar") {
      closePopUp();
    }
  };
  const redirect = (path: string) => {
    router.push(path);
  };
  const searchByType = (e: any) => {
    let text = e.target.value;
    setSearchTxt(text);
    if (text === "") {
      setSearchResult([]);
      setCatagorySearchResult((prev: any) => {
        return {
          ...prev,
          cat: [],
          subCat: [],
        };
      });
    } else {
      let arr: any = [];
      let catArr: any = [];
      let subCatArr: any = [];
      let filteredArr = [];
      let filteredCatArr: any = [];
      let filteredSubCatArr: any = [];
      allProducts?.map((i: any) => {
        let searchTitle = i?.title?.toLowerCase()?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          arr.push(i);
        }
      });
      allCatagory?.catArr?.map((i: any) => {
        let searchTitle = i?.catagory
          ?.toLowerCase()
          ?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          catArr.push(i);
        }
      });
      allCatagory?.subCatArr?.map((i: any) => {
        let searchTitle = i?.subCatagory
          ?.toLowerCase()
          ?.search(text?.toLowerCase());
        if (searchTitle !== -1) {
          subCatArr.push(i);
        }
      });
      filteredArr = arr.filter((i: any, v: number) => {
        return v <= 4;
      });
      filteredCatArr = catArr.filter((i: any, v: number) => {
        return v <= 1;
      });
      filteredSubCatArr = subCatArr.filter((i: any, v: number) => {
        return v <= 1;
      });
      setSearchResult(filteredArr);
      setCatagorySearchResult((prev: any) => {
        return { ...prev, cat: filteredCatArr, subCat: filteredSubCatArr };
      });
    }
  };
  useEffect(() => {
    setNavbar(allNavbar);
  }, [allNavbar]);
  useEffect(() => {
    setAllProducts(products);
    setAllCatagory((prev: any) => {
      return {
        ...prev,
        catArr: catagories?.cat,
        subCatArr: catagories?.subCat,
      };
    });
  }, [products, catagories]);
  if (isLoading) {
    return (
      <div className="navbar" onClick={clickOutSide}>
        Loading...
      </div>
    );
  }
  return (
    <div className="navbar" onClick={clickOutSide}>
      <div className="nav-search">
        <input
          type={"text"}
          value={searchTxt}
          onChange={searchByType}
          placeholder={labelConfig?.header_search_placeholder}
        />
        <div
          className="search-button"
          onClick={() => {
            setSearchTxt("");
            setSearchResult([]);
            setCatagorySearchResult((prev: any) => {
              return { ...prev, cat: [], subCat: [] };
            });
          }}
        >
          <i className="fas fa-undo" />
        </div>
      </div>
      {(searchResult?.length > 0 ||
        catagorySearchResult?.cat?.length > 0 ||
        catagorySearchResult?.subCat?.length > 0) && (
        <div className="search-result">
          {searchResult?.map((i: any) => {
            return (
              <div
                className="search-items"
                onClick={() => {
                  redirect(`/product/${i?._id}`);
                  setSearchTxt("");
                  setSearchResult([]);
                  setCatagorySearchResult((prev: any) => {
                    return {
                      ...prev,
                      cat: [],
                      subCat: [],
                    };
                  });
                }}
              >
                {i?.title}
              </div>
            );
          })}
          {catagorySearchResult?.cat?.length > 0 && (
            <>
              <div className="division-title">Catagories</div>
              {catagorySearchResult?.cat?.map((i: any) => {
                return (
                  <div
                    className="search-items"
                    onClick={() => {
                      redirect(`/catagory/${i?._id}`);
                      setSearchTxt("");
                      setSearchResult([]);
                      setCatagorySearchResult((prev: any) => {
                        return {
                          ...prev,
                          cat: [],
                          subCat: [],
                        };
                      });
                    }}
                  >
                    {i?.catagory}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
      <div className="nav-container">
        {navbar?.map((i) => (
          <div className="item">
            <div
              className="catagory"
              onClick={() => {
                redirect(`/catagory/${i?.catagory?._id}`);
                closePopUp();
              }}
            >
              {i?.catagory?.catagory}
            </div>
            <div className="subcatagory">
              {i?.catagory?.subCatagory?.map((v: any) => (
                <div
                  className="sub-item"
                  onClick={() => {
                    redirect(`/subcatagory/${v?.subCatagoryId}`);
                    closePopUp();
                  }}
                >
                  {v?.subCatagoryName}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
