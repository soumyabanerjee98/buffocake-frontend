import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../../config/processID";
import { callApi } from "../../../Functions/util";

export type CarouselLinkEditProps = {
  id: string;
  link: string;
};

const CarouselLinkEdit = (props: CarouselLinkEditProps) => {
  const { id, link } = props;
  const [linkState, setLinkState] = useState(link);
  const isValidHttpUrl = (str: string) => {
    let url;
    try {
      url = new URL(str);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  };
  const EditCarousel = () => {
    if (!isValidHttpUrl(linkState)) {
      toast.error("Not valid url!");
      return;
    }
    callApi(processIDs?.edit_carousel_link, {
      carouselId: id,
      link: linkState,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
            } else {
              toast.error(`${res?.data?.msg}`);
            }
          } else {
            toast.error(`Error: ${res?.status}`);
          }
        }
      )
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  const deleteLink = () => {
    callApi(processIDs?.edit_carousel_link, {
      carouselId: id,
      link: "",
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(`${res?.data?.msg}`);
            } else {
              toast.error(`${res?.data?.msg}`);
            }
          } else {
            toast.error(`Error: ${res?.status}`);
          }
        }
      )
      .catch((err: any) => {
        toast.error(`Error: ${err?.message}`);
      });
  };
  useEffect(() => {
    setLinkState(link);
  }, [link]);
  return (
    <div>
      <input
        type={"text"}
        value={linkState}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLinkState(e.target.value);
        }}
      />
      <button type="button" onClick={EditCarousel}>
        Update
      </button>
      {link && (
        <button type="button" onClick={deleteLink}>
          Delete
        </button>
      )}
    </div>
  );
};

export default CarouselLinkEdit;
