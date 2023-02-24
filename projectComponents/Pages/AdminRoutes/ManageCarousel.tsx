import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import { callApi, uploadImage } from "../../Functions/util";
import useSwr from "swr";
import { responseType } from "../../../typings";
import { serverConfig } from "../../../config/siteConfig";
const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_carousel, {})
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
const ManageCarousel = () => {
  const {
    data: allCarousel,
    isLoading,
    error,
  } = useSwr("manage-carousel", dataFetcher, { refreshInterval: 1 });
  const url =
    process?.env?.NODE_ENV === "development"
      ? serverConfig?.backend_url_test
      : serverConfig?.backend_url_server;
  const [carousel, setCarousel] = useState(allCarousel);
  const [editId, setEditId] = useState({
    carouselId: "",
    mediaPath: "",
  });
  const AddCarousel = (e: any) => {
    const fileArr = Array.from(e.target.files);
    uploadImage(fileArr)
      // @ts-ignore
      .then((res: responseType) => {
        if (res?.status === 200) {
          if (res?.data?.returnCode) {
            callApi(processIDs?.add_carousel, {
              mediaPath: res?.data?.returnData?.[0]?.path,
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
  const EditCarousel = (e: any) => {
    const fileArr = Array.from(e.target.files);
    callApi(processIDs?.delete_photo, {
      mediaPath: editId?.mediaPath,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              uploadImage(fileArr)
                // @ts-ignore
                .then((res: responseType) => {
                  if (res?.status === 200) {
                    if (res?.data?.returnCode) {
                      callApi(processIDs?.edit_carousel, {
                        carouselId: editId?.carouselId,
                        mediaPath: res?.data?.returnData?.[0]?.path,
                      })
                        .then(
                          // @ts-ignore
                          (res: responseType) => {
                            if (res?.status === 200) {
                              if (res?.data?.returnCode) {
                                toast.success(`${res?.data?.msg}`);
                                setEditId((prev: any) => {
                                  return {
                                    ...prev,
                                    carouselId: "",
                                    mediaPath: "",
                                  };
                                });
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
  const DeleteCarousel = (id: string, path: string) => {
    callApi(processIDs?.delete_photo, {
      mediaPath: path,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              callApi(processIDs?.delete_carousel, {
                carouselId: id,
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
    setCarousel(allCarousel);
  }, [allCarousel]);
  if (isLoading) return <>Loading...</>;
  return (
    <div className="manage-carousel">
      <div className="left-col">
        {carousel?.length === 0 && <div>No Carousel found</div>}
        {carousel?.length > 0 && (
          <div className="image-container">
            {carousel?.map((i: any) => {
              return (
                <div className="image">
                  <img src={`${url}${i?.mediaPath}`} height={200} />
                  <div className="action-button">
                    <button
                      onClick={() => {
                        setEditId((prev: any) => {
                          return {
                            ...prev,
                            carouselId: i?._id,
                            mediaPath: i?.mediaPath,
                          };
                        });
                        document.getElementById("carousel-image-edit")?.click();
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        DeleteCarousel(i?._id, i?.mediaPath);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="right-col">
        <button
          type="button"
          onClick={() => {
            document.getElementById("carousel-image-upload")?.click();
          }}
        >
          Add Carousel
        </button>
        <input
          style={{ display: "none", appearance: "none" }}
          id="carousel-image-upload"
          type={"file"}
          accept={"image/*"}
          multiple={false}
          onChange={AddCarousel}
        />
        <input
          style={{ display: "none", appearance: "none" }}
          id="carousel-image-edit"
          type={"file"}
          accept={"image/*"}
          multiple={false}
          onChange={EditCarousel}
        />
      </div>
    </div>
  );
};

export default ManageCarousel;
