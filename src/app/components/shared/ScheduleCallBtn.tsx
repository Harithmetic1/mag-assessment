"use client";
import React from "react";
import CustomButton from "./CustomButton";
import { useComponentStore } from "@/app/store/componentStore";

const ScheduleCallBtn = () => {
  const setOpenModal = useComponentStore((state) => state.setOpenModal);

  return (
    <CustomButton
      btnName="Schedule a call"
      onClick={() => setOpenModal(true)}
    />
  );
};

export default ScheduleCallBtn;
