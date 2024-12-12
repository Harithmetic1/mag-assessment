import { create } from "zustand";

interface ComponentState{
    openModal: boolean,
    selectedTimeSlot: string,
    setOpenModal: ( open: boolean ) => void,
    setSelectedTimeSlot: (time: string) => void
}

export const useComponentStore = create<ComponentState>()((set) => ({
    openModal: false,
    selectedTimeSlot: "",
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