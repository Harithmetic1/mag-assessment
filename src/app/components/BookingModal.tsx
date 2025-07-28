"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

import { DateBefore, DayOfWeek, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import TimeSlotCards from "./shared/TimeSlotCards";
import FormInput from "./shared/FormInput";
import CustomButton from "./shared/CustomButton";
import { useComponentStore } from "../store/componentStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { bookingType } from "../api/booking/model";
import {
  formatDate,
} from "../utils/utils";
import { getAvailableBusinessTimeSlots } from "../utils/availabilityUtils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { submitBooking } from "@/lib/submit-booking";
import { MAGBookingConfig } from "../utils/config";
import { bookingPayload } from "@/lib/validation";

const BookingModal = () => {
  const currentAllowedDate = React.useMemo(() => {
    const today = new Date()
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const dayOfTomorrow =  today.getDate() == lastDate.getDate() ? 1 : today.getDate() + 1

    return new Date(today.getFullYear(), today.getMonth(), dayOfTomorrow)
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>();
  // const [bookingDateCollection, setBookingDateCollection] = useState<
  //   Record<string, any>
  // >([]);
  const [selectedDateBookedTime, setSelectedDateBookedTime] = useState<
    string[]
  >([""]);
  const [scrollY, setScrollY] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  // const [timeSlots, setTimeSlots] = useState<TimeSlotsResponse | null>()
  const [bookingFormError, setBookingFormError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<bookingType>({
    defaultValues: {
      bookingDate: "",
      bookingEmail: "",
      bookingName: "",
      bookingTime: "",
      bookingNote: "",
      bookingPhoneNumber: "",
      bookingConsent: false,
    },
  });
  const queryClient = useQueryClient();

  const openModal = useComponentStore((state) => state.openModal);
  const setOpenModal = useComponentStore((state) => state.setOpenModal);
  const selectedTimeSlot = useComponentStore((state) => state.selectedTimeSlot);

  // const handleSetScrollY = () => {
  //   if (openModal) {
  //     setScrollY(window.scrollY);
  //   }
  // };

  useEffect(() => {
    // This code runs only in the browser
    setScrollY(window.scrollY);
    queryClient.refetchQueries({
      queryKey: ["bookings"],
      refetchType: "active",
    });
  }, [openModal, queryClient]);

  useEffect(() => {
    setSelectedDate(currentAllowedDate);
  }, [currentAllowedDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowStatus(false);
    }, 15000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showStatus]);

  const handleSelectedBookedTime = useCallback(() => {
    let index;
    if (selectedDate) {
      index = formatDate(selectedDate);
    } else {
      index = formatDate(currentAllowedDate);
    }

    console.log(index);
    
    setSelectedDateBookedTime([]);
  }, [ selectedDate, currentAllowedDate]);

  const { data: timeSlots, isLoading: getTimeSlotsLoading } = useQuery({
    queryKey: ["time-slots", selectedDate?.toISOString()],
    queryFn: async () => {
    const { data, error } = await getAvailableBusinessTimeSlots({ date: selectedDate });

    if (error !== null && isSubmitted) {
      // console.log(error);
      setBookingFormError(error)
      setShowStatus(true)
      return
    }

    // console.log("Booking Slots: ", data, error);
    
    return data;

    },
    enabled: !!selectedDate
  })

  // const handleCollectBookedTimes = (bookings: Record<string, any>[]) => {
  //   const bookingDateCollection: Record<string, any> = {};

  //   bookings.forEach((booking) => {
  //     if (bookingDateCollection[booking["bookingDate"]]) {
  //       bookingDateCollection[booking["bookingDate"]].push(
  //         booking["bookingTime"]
  //       );
  //     } else {
  //       bookingDateCollection[booking["bookingDate"]] = [
  //         booking["bookingTime"],
  //       ];
  //     }
  //   });

    // console.log(bookingDateCollection);
    // setBookingDateCollection(bookingDateCollection);
  // };

  // const { data, isError, error } = useQuery({
  //   queryKey: ["bookings"],
  //   queryFn: async () => {
  //     const getBookingsReq = await fetch(`/api/booking`);

  //     const request = await getBookingsReq.json();

  //     if (!getBookingsReq.ok) {
  //       setShowStatus(true);
  //       throw new Error(request.error);
  //     }
  //     return request;
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     handleCollectBookedTimes(data.data);
  //   }
  // }, [data]);

  const formValue = watch();

  const {
    mutateAsync,
    isPending,
    isSuccess,
    isError: makeBookingReqIsError,
    error: makeBookingReqError,
  } = useMutation({
    mutationKey: ["make-booking", formValue.bookingEmail],
    mutationFn: async (data: bookingType) => {
      const submitBookingPayload: bookingPayload = {
        bookingBusinessName: MAGBookingConfig.bookingBusiness,
        bookingBusinessServiceName: MAGBookingConfig.bookingBusinessService,
        startTime: selectedTimeSlot.start,
        endTime: selectedTimeSlot.end,
        lead: {
          companyName: "",
          consent: true,
          dialCode: "+971",
          email: data.bookingEmail,
          environment: "development",
          firstName: "",
          lastName: data.bookingName,
          ipAddress: "::0",
          landingURL: "http://localhost:3000/",
          mobile: data.bookingPhoneNumber,
          submissionArea: "Booking Form",
          website: "Flowspark Booking Test",
        }
      }
      const {data: makeBookingReq, error: makeBookingErr} = await submitBooking(submitBookingPayload)

      if(makeBookingErr !== null){
        setShowStatus(true)
        setBookingFormError(makeBookingErr)
        return makeBookingErr;  
      }

      queryClient.invalidateQueries({
        queryKey: ["time-slots", selectedDate?.toISOString()],
      })

      queryClient.refetchQueries({
        queryKey: ["time-slots", selectedDate?.toISOString()],
        refetchType: "all",
      })

      setShowStatus(true)
      setOpenModal(false)
      return makeBookingReq;
    },
  });

  useEffect(() => {
    handleSelectedBookedTime();
  }, [selectedDate, handleSelectedBookedTime]);

  const handleSubmitBooking = async (data: bookingType) => {
    if (selectedDate) {
      data.bookingDate = formatDate(selectedDate);
    }

    if (selectedTimeSlot) {
      data.bookingTime = selectedTimeSlot.start;
    }

    data.bookingPhoneNumber = data.bookingPhoneNumber.split(" ").join("");
    // Convert data to FormData format
    // const formDataPayload = processFormDataPayload(data);

    await mutateAsync(data);
    setShowStatus(true);
    await queryClient.refetchQueries({ queryKey: ["bookings"] });

    const timeout = setTimeout(() => {
      setOpenModal(false);
    }, 3000);

    clearTimeout(timeout);
  };

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleModalOutsideClick = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      // console.log(e.target);

      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenModal(false);
      }
    },
    [setOpenModal, modalRef]
  );

  //   const handleGetAvailableTimeSlots = React.useCallback(async () => {
  //     setLoadingTimeSlots(true)
  //   const { data, error } = await getAvailableBusinessTimeSlots({ date: selectedDate });
  //     setLoadingTimeSlots(false)

  //   if (error !== null && isSubmitted) {
  //     console.log(error);
  //     setBookingFormError(error)
  //     setShowStatus(true)
  //     return
  //   }

  //   // console.log("Booking Slots: ", data, error);
    

  //   setTimeSlots(data);
  // }, [selectedDate, isSubmitted]);

  // useEffect(() => {
  //   handleGetAvailableTimeSlots()
  // }, [isSubmitted, handleGetAvailableTimeSlots])

  useEffect(() => {
    if (openModal) {
      document.addEventListener("click", handleModalOutsideClick);
    } else {
      document.removeEventListener("click", handleModalOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleModalOutsideClick);
    };
  }, [openModal, selectedDate, handleModalOutsideClick]);

  const disabledDates: DateBefore = { before: currentAllowedDate }
  const disableWeekends: DayOfWeek = {dayOfWeek: [0, 6]}

  return (
    <div
      style={{
        top: scrollY,
        left: 0,
      }}
      className={` ${
        openModal ? "flex" : "hidden"
      } flex-center modal-grey-bg absolute w-full h-full top-0 left-0 z-10`}
    >
      <div
        ref={modalRef}
        className="modal max-h-[83.33%] h-5/6 bg-background rounded-2xl lg:rounded-[50px] flex-center flex-col w-11/12 lg:w-10/12 py-4"
      >
        <div className="w-11/12 lg:p-10 flex-start flex-col h-full modal-overflow overflow-auto gap-10">
          <div className="modal-header flex-between w-full">
            <h1 className="text-2xl lg:text-4xl text-text-body font-quicksand font-semibold">
              Schedule a call at a time that suits you
            </h1>
            <button
              onClick={() => setOpenModal(false)}
              className="bg-btn-secondary p-3 text-white rounded-md"
            >
              <IoMdClose fontSize={24} />
            </button>
          </div>
          <div className="modal-booking flex-center flex-col lg:flex-row lg:justify-evenly w-full items-start gap-10 lg:gap-20">
            <div className="flex-center rounded-md flex-col w-full gap-4">
              <div>
                <h2>Select a Date</h2>
              </div>
              <DayPicker
                className="border border-primary rounded-md"
                disabled={[disabledDates, disableWeekends]}
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                footer={
                  selectedDate
                    ? `Selected: ${selectedDate.toLocaleDateString()}`
                    : "Pick a day."
                }
              />
            </div>
            {
              getTimeSlotsLoading ? <div className="loading w-full flex justify-center items-center h-full">
                <AiOutlineLoading3Quarters className="animate-spin text-foreground w-20 h-20" />
              </div> :
            <div className="flex-center flex-col w-full gap-4">
              {showStatus && bookingFormError && (
                <span className="text-red-500">{bookingFormError}</span>
              )}
              <div>
                <h2>Select a Time</h2>
              </div>
              <div className="timings grid grid-cols-2 lg:grid-cols-3 items-center align-middle justify-center gap-4">
                { timeSlots && timeSlots.map((timeSlot) => (
                  <TimeSlotCards
                    key={timeSlot.start}
                    timeSlot={timeSlot.start}
                    timeSlotValue={timeSlot}
                    bookedTimeSlots={selectedDateBookedTime}
                  />
                ))}
              </div>
            </div>
            }
          </div>
          <div className="w-full lg:w-full bg-secondary flex-center flex-col items-start rounded-3xl py-10">
            {showStatus && isSuccess && (
              <span className="text-green-400 w-11/12 px-4 text-lg lg:text-xl">
                Thank you for requesting for a booking. Someone from the team
                should reach out to you soon!
              </span>
            )}

            {showStatus && makeBookingReqIsError && (
              <span className="text-red-400 w-11/12 px-4 text-lg lg:text-xl">
                {makeBookingReqError.message}
              </span>
            )}
            <form
              onSubmit={handleSubmit(handleSubmitBooking)}
              className="flex-center flex-col gap-10 lg:w-full w-full h-full"
            >
              <div className="flex-center flex-col lg:flex-row gap-10 w-11/12 h-full">
                <div className="name_email w-11/12 h-full flex-center justify-start gap-4 flex-col">
                  <FormInput
                    register={register}
                    label="Full name"
                    name="bookingName"
                    options={{
                      required: "Full Name is required",
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                  <FormInput
                    register={register}
                    label="Email Address"
                    name="bookingEmail"
                    options={{
                      required: "Email Address is required",
                      pattern: {
                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: "Email Address must be valid",
                      },
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                  <FormInput
                    register={register}
                    label="Phone Number"
                    name="bookingPhoneNumber"
                    inputType="phone"
                    setValue={setValue}
                    value={formValue.bookingPhoneNumber}
                    options={{
                      required: "Phone Number is required",
                    }}
                    className="bg-white text-black"
                    errors={errors}
                  />
                </div>
                <div className="notes flex-start flex-col gap-4 w-11/12 h-full">
                  <FormInput
                    register={register}
                    label="Call notes"
                    name="bookingNote"
                    inputType="textarea"
                    errors={errors}
                    className="bg-white text-black"
                    options={{
                      required: "Call Notes is required",
                    }}
                  />
                  <div className="w-full">
                    <FormInput
                      register={register}
                      label="Consent"
                      name="bookingConsent"
                      inputType="checkbox"
                      errors={errors}
                      className="bg-white text-black"
                      options={{
                        required: "Consent is required",
                      }}
                    />
                  </div>
                  <div className="flex-start justify-end w-full">
                    <div className="w-full lg:w-6/12">
                      <CustomButton
                        btnName="Schedule my call"
                        isPending={isPending}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
