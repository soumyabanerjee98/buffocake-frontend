import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { toast } from "react-toastify";
import { processIDs } from "../../config/processID";
import { callApi } from "../Functions/util";
import { messageService } from "../Functions/messageService";
import { useRouter } from "next/router";
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
const Navbar = () => {
  const {
    data: allNavbar,
    isLoading,
    error,
  } = useSwr("header-navbar", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const router = useRouter();
  const [navbar, setNavbar] = useState<any[]>(allNavbar);
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
  useEffect(() => {
    setNavbar(allNavbar);
  }, [allNavbar]);
  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <div className="navbar" onClick={clickOutSide}>
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
