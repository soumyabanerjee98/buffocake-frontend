import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSwr from "swr";
import * as xlsx from "xlsx";
import { processIDs } from "../../../config/processID";
import { responseType } from "../../../typings";
import { callApi } from "../../Functions/util";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_pincodes, {})
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

const ManagePincode = () => {
  const {
    data: allPins,
    isLoading,
    error,
  } = useSwr("manage-pincodes", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const [pins, setPins] = useState<any[]>(allPins);
  const [searchTxt, setSearchTxt] = useState("");
  const removeDuplicates = (arr: any[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;
    setSearchTxt(text);
    let arr: any[] = [];
    allPins?.map((i: any) => {
      let searchPin = i?.toString()?.search(text?.toString());
      if (searchPin !== -1) {
        arr.push(i);
      }
    });
    setPins(arr);
  };
  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files?.[0];
    if (files) {
      const data = await files?.arrayBuffer();
      const excelFile = xlsx?.read(data);
      const sheet = excelFile?.Sheets[excelFile?.SheetNames[0]];
      const excelJson = xlsx?.utils?.sheet_to_json(sheet);
      const pinArr: any[] = [];
      excelJson?.map((i: any, idx: number) => {
        if (idx !== 0) {
          pinArr.push(i?.__EMPTY);
        }
      });
      callApi(processIDs?.add_pincodes, { pincodes: removeDuplicates(pinArr) })
        .then(
          // @ts-ignore
          (res: responseType) => {
            if (res?.status === 200) {
              if (res?.data?.returnCode) {
                toast.success(res?.data?.msg);
                setPins(res?.data?.returnData);
              } else {
                toast.error(res?.data?.msg);
              }
            } else {
              toast.error(`Error: ${res?.status}`);
            }
          }
        )
        .catch((err: any) => {
          toast.error(`Error: ${err?.message}`);
        });
    }
  };
  useEffect(() => {
    setPins(allPins);
  }, [allPins]);
  return (
    <div className="manage-pincode">
      <div className="input-section">
        <input
          type={"number"}
          value={searchTxt}
          onChange={onSearch}
          placeholder={"Search pincode"}
        />
        <input
          type={"file"}
          accept={
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }
          multiple={false}
          onChange={onFileSelect}
          placeholder={"Select XLSX sheet to upload"}
        />
      </div>
      <div className="all-pins">
        {isLoading && <>Loading...</>}
        {pins?.length === 0 && <div>No pincodes</div>}
        {pins?.map((i) => (
          <div>{i}</div>
        ))}
      </div>
    </div>
  );
};

export default ManagePincode;
