"use client";
import { useTheme } from "next-themes";
import React from "react";
import { FaAngleDown, FaRegUserCircle } from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import { HiOutlineDesktopComputer, HiOutlineSupport } from "react-icons/hi";
import { IoIosChatbubbles } from "react-icons/io";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const HeaderBtns = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-center w-full py-4 min-h-14 font-isidora font-semibold text-[10px] leading-[11px]">
      <div className="w-full px-4 flex-between text-xs lg:text-lg flex-wrap gap-2">
        <div className="left-btns flex-center uppercase gap-7">
          <div className="flex-center grey_round gap-3 text-[10px] leading-[11px]">
            <FiGlobe fontSize={16} width={16} height={16} />
            <div className="flex-center items-center gap-[6px] h-full">
              <p>EN</p> <FaAngleDown fontSize={8} />
            </div>
          </div>
          <div className="flex-center grey_round gap-3 text-[10px] leading-[11px]">
            <IoIosChatbubbles fontSize={16} />
            <p>CHAT TO SALES</p>
          </div>
          <div className="flex-center grey_round gap-3 text-[10px] leading-[11px]">
            <HiOutlineSupport fontSize={16} />
            <p>SUPPORT</p>
          </div>
        </div>
        <div className="flex-center uppercase gap-4">
          <div className="theme_options grey_round flex-center gap-3">
            <div
              className="system_mode flex-center flex-col gap-1 cursor-pointer
              "
              onClick={() => {
                setTheme("system");
              }}
            >
              <HiOutlineDesktopComputer fontSize={14} />
              {theme == "system" && (
                <div className="w-[14px] h-[1px] bg-primary rounded-[20px]"></div>
              )}
            </div>
            <div
              className="light_mode flex-center flex-col gap-1 cursor-pointer
              "
              onClick={() => {
                setTheme("light");
              }}
            >
              <IoSunnyOutline fontSize={14} />
              {theme == "light" && (
                <div className="w-[14px] h-[1px] bg-primary rounded-[20px]"></div>
              )}
            </div>
            <div
              className="dark_mode flex-center flex-col gap-1 cursor-pointer
              "
              onClick={() => {
                setTheme("dark");
              }}
            >
              <IoMoonOutline fontSize={14} />
              {theme == "dark" && (
                <div className="w-[14px] h-[1px] bg-primary rounded-[20px]"></div>
              )}
            </div>
          </div>
          <div className="flex-center gap-3 grey_round text-[10px] leading-[11px]">
            <FaRegUserCircle fontSize={14} />
            <p>LOG IN</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBtns;
