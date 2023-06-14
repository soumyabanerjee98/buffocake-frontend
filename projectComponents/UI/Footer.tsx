import React, { useEffect, useState } from "react";
import { colorConfig } from "../../config/siteConfig";
import DeliveryIcon from "./Icons/DeliveryIcon";
import HappyIcon from "./Icons/HappyIcon";
import ShieldIcon from "./Icons/ShieldIcon";
import { callApi, metaUrlGenerate } from "../Functions/util";
import { processIDs } from "../../config/processID";
import { toast } from "react-toastify";
import useSwr from "swr";

const GetAllCatagories = async () => {
  let catData = await callApi(processIDs?.get_catagory, {})
    .then(
      // @ts-ignore
      (res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            return res?.data?.returnData;
          } else {
            toast.error(`${res?.data?.msg}`);
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

  return catData;
};

const Footer = () => {
  const {
    data: catagories,
    isLoading: catagoryLoading,
    error: catagoryError,
  } = useSwr("footer-get-catagories", GetAllCatagories, {
    refreshInterval: 30000,
  });

  const [allCatagory, setAllCatagory] = useState<any[]>([]);

  useEffect(() => {
    setAllCatagory(catagories);
  }, [catagories]);
  return (
    <footer className="main-footer">
      <div className="first-row">
        <div className="row-item">
          <ShieldIcon className="footer-banner-icon" fill={colorConfig?.s_3} />
          <div className="title">100% secure payments</div>
          <div className="desc">
            All major trusted payment methods are accepted
          </div>
        </div>
        <div className="row-item">
          <HappyIcon className="footer-banner-icon" fill={colorConfig?.s_3} />
          <div className="title">10,000+ happy customers</div>
          <div className="desc">
            We always try our best to keep the quality more than expected
          </div>
        </div>
        <div className="row-item">
          <DeliveryIcon
            className="footer-banner-icon"
            fill={colorConfig?.s_3}
          />
          <div className="title">100% safe delivery</div>
          <div className="desc">
            We make sure your delivery reaches to your doorstep right on time
          </div>
        </div>
      </div>
      <div className="second-row">
        {allCatagory
          ?.filter((x: any, ind: number) => {
            return ind <= 9;
          })
          ?.map((i: any) => {
            return (
              <div className="cat-item">
                <div className="cat-name">
                  <a
                    href={`/catagory/${metaUrlGenerate(i?.catagory)}`}
                    target="_blank"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {i?.catagory}
                  </a>
                </div>
                {i?.subCatagory
                  ?.filter((y: any, idx: number) => {
                    return idx <= 9;
                  })
                  ?.map((v: any) => {
                    return (
                      <div className="subcat-name">
                        <a
                          href={`/subcatagory/${metaUrlGenerate(
                            v?.subCatagoryName
                          )}`}
                          target="_blank"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {v?.subCatagoryName}
                        </a>
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </footer>
  );
};

export default Footer;
