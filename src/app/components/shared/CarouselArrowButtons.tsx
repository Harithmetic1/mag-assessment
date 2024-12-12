"use client";
import React, {
  ComponentPropsWithRef,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";
import { Timer } from "@/app/utils/utils";
import ImageContainer from "./ImageContainer";

type UsePrevNextButtonsType = {
  selectedIndex: number;
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
  onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UsePrevNextButtonsType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const timer = Timer(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, 3000);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    timer.reset();
    if (onButtonClick) {
      onButtonClick(emblaApi);
    }
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    timer.reset();
    if (onButtonClick) {
      onButtonClick(emblaApi);
    }
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(emblaApi.canScrollPrev());
    setNextBtnDisabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    selectedIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type CarouselPrevButton = ComponentPropsWithRef<"button">;

export const CarouselPrevButton: FC<CarouselPrevButton> = (props) => {
  const { children, disabled, ...otherProps } = props;
  return (
    <button
      className={`w-10 h-10 border-2 rounded-md ${
        disabled ? "border-gray-100" : "border-primary"
      }  p-2 flex-center`}
      {...otherProps}
    >
      <ImageContainer
        src="/icons/arrow-right.svg"
        alt="right arrow"
        className="rotate-180"
        w={20}
        h={20}
      />

      {children}
    </button>
  );
};

type CarouselNextButton = ComponentPropsWithRef<"button">;

export const CarouselNextButton: FC<CarouselNextButton> = (props) => {
  const { children, disabled, ...otherProps } = props;
  return (
    <button
      className={`w-10 h-10 border-2 rounded-md ${
        disabled ? "border-gray-100" : "border-primary"
      } p-2 flex-center`}
      {...otherProps}
    >
      <ImageContainer
        src="/icons/arrow-right.svg"
        alt="right arrow"
        w={20}
        h={20}
      />
      {children}
    </button>
  );
};
