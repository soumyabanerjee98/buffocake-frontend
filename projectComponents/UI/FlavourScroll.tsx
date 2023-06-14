import React from "react";
import Chocolate from "../../projectComponents/Assets/Images/chocolate-flavour-500x500.webp";
import Butterscotch from "../../projectComponents/Assets/Images/butterscotch.jpg";
import Coffee from "../../projectComponents/Assets/Images/coffee-flavour-500x500.webp";
import WhiteForest from "../../projectComponents/Assets/Images/Eggless-White-Forest-Cake-3.jpg";
import BlackForest from "../../projectComponents/Assets/Images/Black-Forest-Cake-7.jpg";
import Oreo from "../../projectComponents/Assets/Images/oreo-cake.webp";
import RosePistachio from "../../projectComponents/Assets/Images/Pistachio-rose.jpg";
import Strawberry from "../../projectComponents/Assets/Images/strawberry-flavour-500x500.webp";
import Vanilla from "../../projectComponents/Assets/Images/Vanilla.jpg";
import Blueberry from "../../projectComponents/Assets/Images/blueberrybirthdaycake_2400x.png";
import Image from "next/image";
import { metaUrlGenerate } from "../Functions/util";

const FlavourScroll = () => {
  const flavourdatajson = [
    { name: "Chocolate", image: Chocolate },
    { name: "Butterscotch", image: Butterscotch },
    { name: "Coffee", image: Coffee },
    { name: "White Forest", image: WhiteForest },
    { name: "Black Forest", image: BlackForest },
    { name: "Oreo", image: Oreo },
    { name: "Rose Pistachio", image: RosePistachio },
    { name: "Strawberry", image: Strawberry },
    { name: "Vanilla", image: Vanilla },
    { name: "Blueberry", image: Blueberry },
  ];
  return (
    <>
      <div className="flavour-scroll-heading">Flavours</div>
      <div className="flavour-scroll">
        {flavourdatajson?.map((i) => (
          <a
            className="flavour-circle"
            href={`/subcatagory/${metaUrlGenerate(i?.name)}`}
            target="_blank"
          >
            <Image
              src={i?.image}
              alt={i?.name}
              height={100}
              width={100}
              priority
              className="flavour-image"
            />
            <div className="flavour-name">{i?.name}</div>
          </a>
        ))}
      </div>
    </>
  );
};

export default FlavourScroll;
