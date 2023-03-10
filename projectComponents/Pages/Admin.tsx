import React, { useEffect, useState } from "react";
import { storageConfig } from "../../config/siteConfig";
import { getSessionObjectData } from "../Functions/util";
import ManageCarousel from "./AdminRoutes/ManageCarousel";
import ManageCustomNav from "./AdminRoutes/ManageCustomNav";
import ManageOfflineOrders from "./AdminRoutes/ManageOfflineOrders";
import ManageOrders from "./AdminRoutes/ManageOrders";
import ManagePincode from "./AdminRoutes/ManagePincode";
import ManageProducts from "./AdminRoutes/ManageProducts";
import ManageUsers from "./AdminRoutes/ManageUsers";

const Admin = () => {
  const sectionArr = [
    "Orders",
    "Products",
    "Custom Navigation",
    "Carousel",
    "Offline Orders",
    "Pincode manage",
  ];
  const [section, setSection] = useState(() => {
    let arr = sectionArr.map((i: string, idx: number) => {
      if (idx === 0) {
        return { id: idx, type: i, active: true };
      }
      return { id: idx, type: i, active: false };
    });
    if (getSessionObjectData(storageConfig?.userProfile)?.superAdmin) {
      arr.push({ id: arr.length, type: "User management", active: false });
    }
    return arr;
  });
  const sectionSelect = (id: number) => {
    setSection(
      section.map((v: any, idx: number) => {
        if (id === idx) {
          return { ...v, active: true };
        }
        return { ...v, active: false };
      })
    );
  };
  const SectionRender = () => {
    let active: number = NaN;
    section?.map((i: any) => {
      if (i?.active) {
        active = i?.id;
      }
    });
    switch (active) {
      case 0:
        return <ManageOrders />;
        break;
      case 1:
        return <ManageProducts />;
        break;
      case 2:
        return <ManageCustomNav />;
        break;
      case 3:
        return <ManageCarousel />;
        break;
      case 4:
        return <ManageOfflineOrders />;
        break;
      case 5:
        return <ManagePincode />;
        break;
      case 6:
        return <ManageUsers />;
        break;
      default:
        break;
    }
  };
  return (
    <div className="admin-screen">
      <div className="header">
        {section?.map((i: any, idx: number) => (
          <div
            key={`profile-section-${idx}`}
            className={`section-title ${i?.active ? "active" : ""}`}
            onClick={() => {
              sectionSelect(i?.id);
            }}
          >
            {i?.type}
          </div>
        ))}
      </div>
      <hr />
      <div className="render">{SectionRender()}</div>
    </div>
  );
};

export default Admin;
