import Link from "next/link";
import React from "react";
import { LuLoaderCircle } from "react-icons/lu";

type CustomButtonProps = {
  btnName: string;
  invertBtn?: boolean;
  isPending?: boolean;
  isLink?: boolean;
  href?: string;
  onClick?: () => void;
};

const CustomButton = ({
  btnName,
  onClick,
  isPending,
  isLink,
  href = "",
  invertBtn = false,
}: CustomButtonProps) => {
  return (
    <>
      {isLink ? (
        <Link
          className={`min-w-[200px] py-4 font-sans flex-center gap-4 font-bold rounded-full w-full text-nowrap hover:shadow-md transition-all ${
            invertBtn
              ? "bg-transparent border-2 border-primary text-btn-text"
              : "bg-primary text-white"
          }`}
          href={href!}
        >
          {btnName}
        </Link>
      ) : (
        <button
          className={`min-w-[200px] py-4 font-sans flex-center gap-4 font-bold rounded-full w-full text-nowrap hover:shadow-md transition-all ${
            invertBtn
              ? "bg-transparent border-2 border-primary text-btn-text"
              : "bg-primary text-white"
          }`}
          onClick={onClick}
        >
          {btnName}{" "}
          {isPending && (
            <LuLoaderCircle
              className={`${
                invertBtn ? "text-primary text-2xl" : "text-white"
              } animate-spin`}
            />
          )}
        </button>
      )}
    </>
  );
};

export default CustomButton;
