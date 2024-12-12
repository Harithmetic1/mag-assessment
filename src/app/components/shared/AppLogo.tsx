import Image from "next/image";
import React from "react";

const AppLogo = () => {
  return (
    <div className="w-[170px] h-[30.81px] relative">
      <Image
        src={"/flowspark-logo.webp"}
        alt="flow spark logo"
        className="object-cover"
        fill
      />
    </div>
  );
};

export default AppLogo;
