import { create } from "zustand";
import { Timer, TimerObjectDef } from "../utils/utils";
import { EmblaCarouselType } from "embla-carousel";
import { TimeSlot } from "../utils/availabilityUtils";

interface ComponentState{
    openModal: boolean,
    selectedTimeSlot: TimeSlot,
    carouselTimer: TimerObjectDef | null,
    carouselController: EmblaCarouselType | null,
    setOpenModal: ( open: boolean ) => void,
    setSelectedTimeSlot: (time: TimeSlot) => void
    setCarouselTimer: (emblaApi: EmblaCarouselType | undefined) => void
}

export const useComponentStore = create<ComponentState>()((set) => ({
    openModal: false,
    selectedTimeSlot: { 
        start: "",
        end: "",
        staffIds: []
    },
    carouselTimer: null,
    carouselController: null,
    setCarouselTimer: (emblaApi) => {
        const timer = Timer(() => {
            if (!emblaApi) return;
            emblaApi.scrollNext();
          }, 3000)

          timer.start()
          
        return set({
            carouselTimer: timer,
             carouselController: emblaApi
        })
    },
    setOpenModal: (open) => {

        if (typeof window !== undefined){
            if (open){
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        }

        return set({
            openModal: open
        })
    },
    setSelectedTimeSlot: (time) => {
        set({
            selectedTimeSlot: time
        })
    }
}))