import React, { useState } from "react";
import ManageCarousel from "./AdminRoutes/ManageCarousel";
import ManageCustomNav from "./AdminRoutes/ManageCustomNav";
import ManageOrders from "./AdminRoutes/ManageOrders";
import ManageProducts from "./AdminRoutes/ManageProducts";

const Admin = () => {
  const sectionArr = ["Orders", "Products", "Custom Navigation", "Carousel"];
  const [section, setSection] = useState(
    sectionArr.map((i: string, idx: number) => {
      if (idx === 0) {
        return { id: idx, type: i, active: true };
      }
      return { id: idx, type: i, active: false };
    })
  );
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
