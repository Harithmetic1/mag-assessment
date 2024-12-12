import Image from "next/image";
import React from "react";

type ImageContainerProps = {
  fill?: boolean;
  w?: number;
  h?: number;
  className?: string;
  imgClassName?: string;
  src: string;
  alt: string;
};

const ImageContainer = ({
  fill,
  w,
  h,
  src,
  alt,
  className = "",
  imgClassName = "object-cover",
}: ImageContainerProps) => {
  if (fill) {
    return (
      <div className={`relative ${className}`}>
        <Image src={src} alt={alt} fill className={`${imgClassName}`} />
      </div>
    );
  } else if (fill && w && h && className) {
    return (
      <div>
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          className={`object-cover ${className}`}
        />
      </div>
    );
  }

  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className={`object-cover ${className}`}
      />
    </div>
  );
};

export default ImageContainer;
