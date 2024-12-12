"use client";
import React from "react";

export type FeatureCardProps = {
  id: number;
  featureTitle: string;
  featureDescription: string;
  selected?: number;
  setSelected?: React.Dispatch<React.SetStateAction<number>>;
};

const FeatureCard = ({
  id,
  featureTitle,
  featureDescription,
  selected,
  setSelected,
}: FeatureCardProps) => {
  return (
    <div
      onClick={() => setSelected!(id)}
      className="flex-center gap-5 cursor-pointer"
    >
      <div
        className={`w-1 h-12 rounded-full ${
          selected == id ? "bg-primary" : "bg-accent"
        }`}
      ></div>
      <div className="flex-star gap-1">
        <h3 className="font-semibold">{featureTitle}</h3>
        <p>{featureDescription}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
