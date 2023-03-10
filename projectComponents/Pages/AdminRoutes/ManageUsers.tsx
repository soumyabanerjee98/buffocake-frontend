import React, { useEffect, useState } from "react";
import useSwr from "swr";
import { toast } from "react-toastify";
import { processIDs } from "../../../config/processID";
import { callApi, getSessionObjectData } from "../../Functions/util";
import { responseType } from "../../../typings";
import { storageConfig } from "../../../config/siteConfig";
import { messageService } from "../../Functions/messageService";

const dataFetcher = async () => {
  let data = await callApi(processIDs?.get_all_users, {})
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

const ManageUsers = () => {
  const [searchTxt, setSearchTxt] = useState("");
  const {
    data: allUsers,
    isLoading,
    error,
  } = useSwr("manage-users", dataFetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });
  const [users, setUsers] = useState<any[]>(allUsers);
  const [confirmationBox, setConfirmationBox] = useState({
    state: false,
    user: null,
  });
  const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value.replaceAll("+", "");
    setSearchTxt(text);
    if (e.target.value === "") {
      setUsers(allUsers);
    } else {
      let arr: any[] = [];
      allUsers?.map((i: any) => {
        let searchNumber = i?.phoneNumber?.search(text);
        let searchName = `${i?.firstName} ${i?.lastName}`
          ?.toLowerCase()
          ?.search(text?.toLocaleLowerCase());
        if (searchNumber !== -1 || searchName !== -1) {
          arr.push(i);
        }
      });
      setUsers(arr);
    }
  };
  const reset = () => {
    setUsers(allUsers);
    setSearchTxt("");
  };
  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);
  const adminToggle = (user: any, bool: boolean) => {
    if (user?._id === getSessionObjectData(storageConfig?.userProfile)?.id) {
      toast.error("Super admin can not disable admin for self");
      return;
    }
    callApi(processIDs?.update_user_as_admin, {
      userId: user?._id,
      admin: bool,
      superAdmin: user?.superAdmin,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              toast.success(res?.data?.msg);
              setUsers(res?.data?.returnData);
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
  };
  const superAdminToggle = (user: any, bool: boolean) => {
    callApi(processIDs?.update_user_as_admin, {
      userId: user?._id,
      admin: user?.admin,
      superAdmin: bool,
    })
      .then(
        // @ts-ignore
        (res: responseType) => {
          if (res?.status === 200) {
            if (res?.data?.returnCode) {
              callApi(processIDs?.update_user_as_admin, {
                userId: getSessionObjectData(storageConfig?.userProfile)?.id,
                admin: true,
                superAdmin: false,
              })
                .then(
                  // @ts-ignore
                  (res: responseType) => {
                    if (res?.status === 200) {
                      if (res?.data?.returnCode) {
                        messageService?.sendMessage(
                          "admin-page",
                          // @ts-ignore
                          { action: "logout" },
                          "global"
                        );
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
  };
  const clickOutSide = (e: React.MouseEvent<HTMLDivElement>) => {
    // @ts-ignore
    if (e.target.className === "confirm-modal") {
      setConfirmationBox((prev: any) => {
        return { ...prev, state: false, user: null };
      });
    }
  };
  return (
    <div className="manage-users">
      <div className="search-section">
        <input
          type={"text"}
          value={searchTxt}
          onChange={searchUser}
          placeholder={"Search by name or phone number (without +91)"}
        />
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
      <div className="users-section">
        {users?.map((i) => (
          <div className="user-card">
            <div className="user-name">
              {i?.firstName} {i?.lastName}
            </div>
            <div className="user-contact">{i?.phoneNumber}</div>
            <div className="user-email">
              {i?.email ? (
                i?.email
              ) : (
                <span style={{ opacity: "0.6" }}>No email registered</span>
              )}
            </div>
            <div className="user-auth">
              <div className="admin">
                <div className="label">Admin</div>
                <input
                  type={"checkbox"}
                  checked={i?.admin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    adminToggle(i, e.target.checked);
                  }}
                />
              </div>
              <div className="super-admin">
                <div className="label">Super admin</div>
                <input
                  type={"checkbox"}
                  checked={i?.superAdmin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      if (i?.admin) {
                        setConfirmationBox((prev: any) => {
                          return { ...prev, state: true, user: i };
                        });
                      } else {
                        toast.error(
                          "User must be admin in order to be super admin"
                        );
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {confirmationBox?.state && (
        <div className="confirm-modal" onClick={clickOutSide}>
          <div className="confirm-box">
            <div className="warning">
              You will no longer be super admin and logged out of the session
            </div>
            <div>Do you wish to continue?</div>
            <div className="decision-box">
              <button
                onClick={() => {
                  superAdminToggle(confirmationBox?.user, true);
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setConfirmationBox((prev: any) => {
                    return { ...prev, state: false, user: null };
                  });
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
