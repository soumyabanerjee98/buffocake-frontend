import React from "react";
import { useRouter } from "next/router";
import NoResult from "../Assets/Images/404-error.png";
import Image from "next/image";

const PageNotFound = () => {
  const redirect = useRouter();
  return (
    <div className="page-not-found">
      <Image src={NoResult} alt="No result" height={100} priority={true} />
      <div>Oops! Page not found</div>
      <div className="home-redirect" onClick={() => redirect.push("/")}>
        Go back to Home
      </div>
    </div>
  );
};

export default PageNotFound;
