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
import { useComponentStore } from "@/app/store/componentStore";

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

  const setCarouselTimer = useComponentStore((state) => state.setCarouselTimer);
  const carouselTimer = useComponentStore((state) => state.carouselTimer);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    if (carouselTimer) {
      carouselTimer.reset();
    }
    if (onButtonClick) {
      onButtonClick(emblaApi);
    }
  }, [emblaApi, onButtonClick]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    if (carouselTimer) {
      carouselTimer.reset();
    }
    if (onButtonClick) {
      onButtonClick(emblaApi);
    }

    return () => {
      if (carouselTimer) {
        carouselTimer.stop();
      }
    };
  }, [emblaApi, onButtonClick]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(emblaApi.canScrollPrev());
    setNextBtnDisabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    if (!carouselTimer) {
      setCarouselTimer(emblaApi);
    }
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
