import React from "react";
import { messageService } from "../Functions/messageService";
import Congrats from "../Assets/Images/fireworks.png";
import Image from "next/image";
import { useRouter } from "next/router";
export type OrderSuccessCardProps = {
  oid: string;
};
const OrderSuccessCard = (props: OrderSuccessCardProps) => {
  const { oid } = props;
  const router = useRouter();
  const closePopUp = () => {
    router.push("/orders");
    messageService?.sendMessage(
      "order-success-card",
      // @ts-ignore
      { action: "close-popup" },
      "header"
    );
  };
  const clickOutSide = (e: any) => {
    if (e.target.className === "modal") {
      closePopUp();
    }
  };
  React.useEffect(() => {
    setTimeout(() => {
      closePopUp();
    }, 5000);
  }, []);
  return (
    <div className="modal" onClick={clickOutSide}>
      <div className="order-success-card">
        <Image src={Congrats} alt="Congratulations" height={60} width={60} />
        <div className="order-details">
          <div className="section greet">Thank you for shopping with us!</div>
          <div className="section">
            Your order ID is: <span className="oid">{oid}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessCard;
