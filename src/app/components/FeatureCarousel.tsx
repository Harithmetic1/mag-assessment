"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  CarouselNextButton,
  CarouselPrevButton,
  usePrevNextButtons,
} from "./shared/CarouselArrowButtons";

import Fade from "embla-carousel-fade";

type FeatureCarouselProp = {
  slides: number[];
  options?: EmblaOptionsType;
};

const FeatureCarousel = ({ slides, options }: FeatureCarouselProp) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()]);

  const {
    selectedIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div>
      <div className="carousel-images">
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {slides.map((index) => (
                <div
                  className="embla__slide img relative w-[60svw] h-[400px] lg:w-[40svw] xl:w-[650px] xl:h-[500px] rounded-3xl"
                  key={index}
                >
                  <Image
                    src={`https://picsum.photos/500/350?v=${index}`}
                    alt="carousel images from picsum"
                    fill
                    className="object-cover embla__slide__img rounded-3xl"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOcP316LgAF5gI8MqGGhAAAAABJRU5ErkJggg=="
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-center w-full mt-3">
        <div className="carousel-btns w-fit flex-center flex-col gap-2">
          <div className="btns flex-center gap-4">
            <CarouselPrevButton
              onClick={onPrevButtonClick}
              disabled={!prevBtnDisabled}
            />
            <div className="carousel-state">
              <p className="font-semibold text-base font-sans">
                {" "}
                {selectedIndex + 1} / 3
              </p>
            </div>
            <CarouselNextButton
              onClick={onNextButtonClick}
              disabled={!nextBtnDisabled}
            />
          </div>
          <div className="progress-bar w-full h-2 rounded-full bg-[#CCEAEB] relative flex-start">
            <div
              style={{ width: ((selectedIndex + 1) / 3) * 100 + "%" }}
              className={`bg-primary h-2 rounded-full absolute top-0 left-0`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCarousel;
