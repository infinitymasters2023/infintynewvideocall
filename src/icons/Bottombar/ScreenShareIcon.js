import * as React from "react";

const ScreenShareIcon = (props) => {
  const [imageSrc, setImageSrc] = React.useState("https://jiomeetpro.jio.com/assets/images/screen-share-2.png");

  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <image
        width="18"
        height="18"
        href={imageSrc}
        fill={props.fillcolor}
        onMouseOver={() => setImageSrc("https://jiomeetpro.jio.com/assets/images/share-hover-2.png")}
        onMouseOut={() => setImageSrc("https://jiomeetpro.jio.com/assets/images/screen-share-2.png")}
      />
    </svg>
  );
};

export default ScreenShareIcon;
