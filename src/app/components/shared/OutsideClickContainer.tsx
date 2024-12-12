"use client";
import React, { useRef } from "react";

type OutsideClickContainerProps = {
  children: React.ReactNode;
};

const OutsideClickContainer = ({ children }: OutsideClickContainerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return <div ref={ref}>{children}</div>;
};

export default OutsideClickContainer;
