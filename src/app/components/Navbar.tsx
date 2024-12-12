"use client";
import React, { useState } from "react";
import CustomButton from "./shared/CustomButton";
import { RxHamburgerMenu } from "react-icons/rx";
import { useComponentStore } from "../store/componentStore";
import AppLogo from "./shared/AppLogo";
import { RiCloseLargeFill } from "react-icons/ri";

const Navbar = () => {
  const setOpenModal = useComponentStore((state) => state.setOpenModal);

  const [openNav, setOpenNav] = useState(false);

  return (
    <nav className="flex-center w-full font-quicksand font-semibold">
      <div className="w-full lg:hidden flex-center flex-col relative">
        <div className="flex-between py-4 px-3 bg-secondary rounded-full lg:hidden w-11/12 ">
          <AppLogo />
          {openNav ? (
            <RiCloseLargeFill onClick={() => setOpenNav(false)} />
          ) : (
            <RxHamburgerMenu onClick={() => setOpenNav(true)} />
          )}
        </div>
        <div
          className={`z-50 ${
            openNav ? "show-nav" : "hidden"
          } absolute top-20 left-0 w-full flex-center`}
        >
          <ul className="flex-center flex-col w-11/12 drop-shadow-lg py-5 rounded-lg bg-input-bg font-bold gap-4 xl:gap-8 text-text-secondary">
            <li>Features</li>
            <li>Industries</li>
            <li>Pricing</li>
            <li>Resources</li>
            <li>
              <CustomButton
                btnName="Schedule a call"
                onClick={() => {
                  setOpenNav(false);
                  setOpenModal(true);
                }}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="hidden lg:flex flex-between bg-secondary rounded-full py-8 px-5 w-11/12 xl:w-10/12">
        <div className="w-full flex-start gap-4 xl:gap-4">
          <AppLogo />

          <div className="w-7/12">
            <ul className="flex-start w-full font-bold gap-4 xl:gap-8 text-text-secondary">
              <li>Features</li>
              <li>Industries</li>
              <li>Pricing</li>
              <li>Resources</li>
            </ul>
          </div>
        </div>
        <div className="flex-center gap-4">
          <CustomButton
            btnName="Schedule a call"
            onClick={() => setOpenModal(true)}
          />
          <CustomButton isLink href="" btnName="Free Trial" invertBtn />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
