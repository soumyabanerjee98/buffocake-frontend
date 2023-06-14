import React from "react";
import { metaUrlGenerate } from "../Functions/util";

const NavCard = () => {
  const navjson = [
    { name: "Theme Cakes", image: "fa-solid fa-cake-candles" },
    { name: "Designer Cakes", image: "fa-solid fa-cake-candles" },
    { name: "Birthday Cakes", image: "fa-solid fa-cake-candles" },
    { name: "Same Day Delivery", image: "fa-solid fa-truck-fast" },
    { name: "Trending Cakes", image: "fa-solid fa-cake-candles" },
    { name: "Hampers", image: "fa-solid fa-gifts" },
  ];

  return (
    <div className="nav-card-container">
      {navjson?.map((i) => (
        <a
          className="nav-card-item"
          href={`/subcatagory/${metaUrlGenerate(i?.name)}`}
          target="_blank"
        >
          <i className={`${i?.image} nav-card-icon`}></i>
          <div className="nav-card-name">{i?.name}</div>
        </a>
      ))}
    </div>
  );
};

export default NavCard;
