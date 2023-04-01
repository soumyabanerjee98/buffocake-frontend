import React from "react";
import { colorConfig } from "../../config/siteConfig";
import DeliveryIcon from "./Icons/DeliveryIcon";
import HappyIcon from "./Icons/HappyIcon";
import ShieldIcon from "./Icons/ShieldIcon";

const Footer = () => {
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
    </footer>
  );
};

export default Footer;
