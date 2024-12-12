import { useComponentStore } from "@/app/store/componentStore";
import { TimeSlotCardState } from "@/app/utils/utils";
import React, { useEffect, useState } from "react";

type TimeSlotCardsProps = {
  timeSlot: string;
  timeSlotValue: string;
  bookedTimeSlots: string[];
};

const TimeSlotCards = ({
  timeSlot,
  timeSlotValue,
  bookedTimeSlots,
}: TimeSlotCardsProps) => {
  const [timeSlotState, setTimeSlotState] = useState<TimeSlotCardState>(
    TimeSlotCardState.AVAILABLE
  );

  const selectedTimeSlot = useComponentStore((state) => state.selectedTimeSlot);
  const setSelectedTimeSlot = useComponentStore(
    (state) => state.setSelectedTimeSlot
  );

  const handleTimeSlotClick = () => {
    setSelectedTimeSlot(timeSlotValue);
  };

  const handleTimeSlotState = () => {
    if (bookedTimeSlots && bookedTimeSlots.includes(timeSlotValue)) {
      setTimeSlotState(TimeSlotCardState.BOOKED);
    } else if (timeSlotValue == selectedTimeSlot) {
      setTimeSlotState(TimeSlotCardState.SELECTED);
    } else {
      setTimeSlotState(TimeSlotCardState.AVAILABLE);
    }
  };

  useEffect(() => {
    handleTimeSlotState();
  }, [
    selectedTimeSlot,
    bookedTimeSlots,
    timeSlotValue,
    timeSlotState,
    handleTimeSlotState,
  ]);

  return (
    <div
      onClick={() => {
        if (timeSlotState !== TimeSlotCardState.BOOKED) {
          handleTimeSlotClick();
        }
      }}
      className={`py-2 items-center w-36 flex-center cursor-pointer font-bold border-2 rounded-full ${
        timeSlotState == TimeSlotCardState.AVAILABLE && "time-slot-available"
      } ${timeSlotState == TimeSlotCardState.BOOKED && "time-slot-booked"} ${
        timeSlotState == TimeSlotCardState.SELECTED && "time-slot-selected"
      } 
      `}
    >
      {timeSlot}
    </div>
  );
};

export default TimeSlotCards;
