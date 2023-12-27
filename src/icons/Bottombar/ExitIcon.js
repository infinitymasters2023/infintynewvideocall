import React from "react";
import { ImExit } from "react-icons/im";

function ExitIcon(props) {
  return (
    <ImExit
      size={props.size || 18}
      color={props.color || "#D9D9D9"}
      style={{ ...props.style }}
    />
  );
}

export default ExitIcon;
