"use client";
import Link from "next/link";
import React from "react";
import CustomButton from "./CustomButton";
import { FaXTwitter } from "react-icons/fa6";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { FaLinkedin, FaYoutube } from "react-icons/fa";
import { useComponentStore } from "@/app/store/componentStore";
import AppLogo from "./AppLogo";

const Footer = () => {
  const setOpenModal = useComponentStore((state) => state.setOpenModal);

  return (
    <footer className="flex-center font-sans flex-col w-full rounded-t-[50px] py-16 bg-tertiary text-accent gap-10">
      <div className="flex-between flex-wrap lg:flex-nowrap w-11/12 lg:w-7/12 justify-center lg:justify-between flex-col items-center text-center lg:text-left lg:flex-row lg:items-start gap-10">
        <div className="product flex justify-center items-center lg:justify-start flex-col gap-4 lg:items-start">
          <div className="footer-link-title font-bold ">Product</div>
          <ul className="flex-start items-center lg:items-start flex-col gap-4 text-center">
            <li>
              <Link href={"/"}>Overview</Link>
            </li>
            <li>
              <Link href={"/"}>Key Features</Link>
            </li>
            <li>
              <Link href={"/"}>Integrations</Link>
            </li>
            <li>
              <Link href={"/"}>Customisation Options</Link>
            </li>
            <li>
              <Link href={"/"}>AI-led Insights</Link>
            </li>
          </ul>
        </div>
        <div className="Academy flex justify-center items-center lg:justify-start flex-col gap-4 lg:items-start">
          <div className="footer-link-title font-bold ">Academy</div>
          <ul className="flex-start items-center lg:items-start flex-col gap-4 text-center">
            <li>
              <Link href={"/"}>Training programme</Link>
            </li>
            <li>
              <Link href={"/"}>Webinars</Link>
            </li>
            <li>
              <Link href={"/"}>Education blog</Link>
            </li>
            <li>
              <Link href={"/"}>FAQs</Link>
            </li>
          </ul>
        </div>
        <div className="support flex justify-center items-center lg:justify-start flex-col gap-4 lg:items-start">
          <div className="footer-link-title font-bold ">Support</div>
          <ul className="flex-start items-center lg:items-start flex-col gap-4 text-center">
            <li>
              <Link href={"/"}>Support Center</Link>
            </li>
            <li>
              <Link href={"/"}>Account login</Link>
            </li>
            <li>
              <CustomButton
                btnName="Schedule a call"
                onClick={() => setOpenModal(true)}
              />
            </li>
          </ul>
        </div>
        <div className="company flex justify-center items-center lg:justify-start flex-col gap-4 lg:items-start">
          <div className="footer-link-title font-bold ">Company</div>
          <ul className="flex-start items-center lg:items-start flex-col gap-4 text-center">
            <li>
              <Link href={"/"}>Partnerships</Link>
            </li>
            <li>
              <Link href={"/"}>Media + Press</Link>
            </li>
            <li>
              <Link href={"/"}>Contact Us</Link>
            </li>
            <li>
              <Link href={"/"}>About</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-center flex-col w-full">
        <div className="flex-center flex-col gap-6">
          <AppLogo />
          <div className="social-links text-2xl flex-center gap-4 text-primary">
            <a href="#" target="_blank">
              <FaXTwitter />
            </a>
            <a href="#" target="_blank">
              <AiFillInstagram />
            </a>
            <a href="#" target="_blank">
              <FaLinkedin />
            </a>
            <a href="#" target="_blank">
              <FaYoutube />
            </a>
            <a href="#" target="_blank">
              <AiFillFacebook />
            </a>
          </div>
          <div className="w-full gap-10 flex-between">
            <Link href={"/"}>Terms of service</Link>
            <Link href={"/"}>Privacy Policy</Link>
          </div>
          <div>
            <p className="text-center text-accent font-bold">
              &copy; 2024 FlowSpark Digital LLC
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
