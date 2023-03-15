import React, { useState } from "react";

export type ToggleButtonProps = {
  state: boolean;
  setState: any;
  label: string;
};

const ToggleButton = (props: ToggleButtonProps) => {
  const { state, setState, label } = props;
  const toggle = () => {
    setState((prev: boolean) => !prev);
  };
  return (
    <div className="toggle-container">
      <div className="label">{label}</div>
      <div
        className={`toggler ${state ? "checked" : ""}`}
        onClick={toggle}
      ></div>
    </div>
  );
};

export default ToggleButton;
