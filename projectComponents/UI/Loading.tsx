import React from "react";

export type LoadingProps = {
  className: string;
};
const Loading = (props: LoadingProps) => {
  const { className } = props;
  return (
    <div className="loader-container">
      <div className={`loader ${className}`}></div>
    </div>
  );
};

export default Loading;
