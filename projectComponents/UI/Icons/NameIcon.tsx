import React from "react";

export type NameIconProps = {
  firstName: string;
  lastName: string;
  className: string;
  onClick: any;
};

const NameIcon = (props: NameIconProps) => {
  const { firstName, lastName, className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      {firstName?.split("")[0]}
      {lastName?.split("")[0]}
    </div>
  );
};

export default NameIcon;
