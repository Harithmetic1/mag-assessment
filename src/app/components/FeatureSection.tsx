"use client";
import React, { useState } from "react";
import FeatureCard, { FeatureCardProps } from "./shared/FeatureCard";
import CustomButton from "./shared/CustomButton";
import FeatureCarousel from "./FeatureCarousel";
import { EmblaOptionsType } from "embla-carousel";
import ImageContainer from "./shared/ImageContainer";

const FeatureSection = () => {
  const [selected, setSelected] = useState(0);

  // store the properties of each property card in an array.
  const features: Array<FeatureCardProps> = [
    {
      id: 0,
      featureTitle: "Effortless Interface",
      featureDescription: "Simplify your marketing",
    },
    {
      id: 1,
      featureTitle: "Seamless connections",
      featureDescription: "Total sync with your tools",
    },
    {
      id: 2,
      featureTitle: "Tailored experience",
      featureDescription: "Customise wit ease",
    },
    {
      id: 3,
      featureTitle: "All-in-One platform",
      featureDescription: "Unified marketing mastery",
    },
    {
      id: 4,
      featureTitle: "Smart Insights",
      featureDescription: "AI-powered marketing intelligence",
    },
  ];

  const OPTIONS: EmblaOptionsType = { loop: true, duration: 30 };
  const SLIDE_COUNT = 3;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys()).map(
    (index) => (index + 1) * (selected + 1)
  );

  return (
    <section className="flex-center w-full my-10">
      <div className="w-11/12 xl:w-10/12 flex-center flex-col lg:flex-row bg-secondary rounded-3xl py-5 lg:py-16 gap-10 h-full relative">
        <div className="absolute -top-5 right-[10%]">
          <ImageContainer
            src="/icons/star_on_features.png"
            alt="small star vector"
            className="hover:animate-ping"
            w={39}
            h={39}
          />
        </div>
        <div className="text-content w-11/12 lg:w-5/12 flex-start items-start flex-col gap-6">
          <div className="text-content-header">
            <h2 className="text-3xl lg:text-4xl font-quicksand font-semibold text-text-body">
              FlowSpark features
            </h2>
          </div>
          <div className="feature-type-container flex-start flex-col items-start gap-4">
            {features.map((feature) => (
              <FeatureCard
                selected={selected}
                setSelected={setSelected}
                key={feature.id}
                featureTitle={feature.featureTitle}
                featureDescription={feature.featureDescription}
                id={feature.id}
              />
            ))}
          </div>
          <div className="flex-start items-start flex-col gap-4">
            <p className="text-justify lg:w-11/12 w-full">
              Experience simplicity with our user-friendly iinterface, designed
              for effortless navigation. Transform complex tasks into simple
              actions, enhancing productivity a nd strategic focus. Enjoy a
              seamless experience that drives reslts and optimizes your
              marketing efforts efficiently.
            </p>
            <div>
              <CustomButton btnName="See more features" invertBtn />
            </div>
          </div>
        </div>
        <div>
          <FeatureCarousel slides={SLIDES} options={OPTIONS} />
        </div>
        <div className="absolute -bottom-7 left-[5%]">
          <ImageContainer
            src="/icons/swirly_arrow.png"
            alt="swirly arrow"
            w={123}
            h={128}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
