import React from "react";
import { useRouter } from "next/router";

const PageNotFound = () => {
  const redirect = useRouter();
  return (
    <div>
      Oops! Page not found
      <div style={{ cursor: "pointer" }} onClick={() => redirect.push("/")}>
        Go back to Home
      </div>
    </div>
  );
};

export default PageNotFound;
