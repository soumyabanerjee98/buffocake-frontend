import React from "react";
import { useRouter } from "next/router";
import Broken from "../Assets/Images/broken.png";
import Image from "next/image";

const PageNotFound = () => {
  const redirect = useRouter();
  return (
    <div className="page-not-found">
      <Image src={Broken} alt="Broken" height={100} priority={true} />
      <div>Oops! Page not found</div>
      <div className="home-redirect" onClick={() => redirect.push("/")}>
        Go back to Home
      </div>
    </div>
  );
};

export default PageNotFound;
